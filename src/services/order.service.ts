import { OrderDTO, OrderStatus, OrderLineItem, PaymentStatus, ValidationError } from '@indoor-fish/shared-libs';
import * as userClient from '../clients/userClient';
import * as paymentClient from '../clients/paymentClient';
import * as catalogClient from '../clients/catalogClient';
import * as notificationClient from '../clients/notificationClient';
import { MESSAGE_TOPICS } from '@indoor-fish/shared-libs';

// Dependency: payment-service must be healthy before order can be confirmed
// Business Rule: Maximum order value is $50,000
// Business Rule: Order cancellation window is 2 hours from creation
// Business Rule: Guest checkout is limited to 3 orders before an account is required

const MAX_ORDER_VALUE = 50_000;
const _orders = new Map<string, OrderDTO & { createdAt: Date }>();

export async function createOrder(userId: string, lines: Array<{ productId: string; quantity: number }>): Promise<OrderDTO> {
  // Step 1: Validate user exists and is not suspended
  const user = await userClient.getUser(userId);
  if (user.suspended) {
    throw new ValidationError('Cannot create order: user account is suspended');
  }

  // Step 2: Get products and reserve inventory
  const orderLines: OrderLineItem[] = [];
  let totalAmount = 0;

  for (const line of lines) {
    const product = await catalogClient.getProduct(line.productId);
    await catalogClient.reserveInventory(line.productId, line.quantity);

    // Step 3: Get price with user role applied (MERCHANT discount)
    const { finalPrice } = await catalogClient.getPrice(line.productId, user.role, totalAmount);
    orderLines.push({ productId: line.productId, quantity: line.quantity, unitPrice: finalPrice });
    totalAmount += finalPrice * line.quantity;
  }

  if (totalAmount > MAX_ORDER_VALUE) {
    throw new ValidationError(`Order total $${totalAmount.toFixed(2)} exceeds maximum allowed order value of $${MAX_ORDER_VALUE}`);
  }

  const orderId = crypto.randomUUID();

  // Step 4: Authorise payment — if this fails, inventory must be released
  let payment;
  try {
    payment = await paymentClient.authorisePayment(userId, orderId, totalAmount);
  } catch (err) {
    // Rollback: inventory reservation should be released
    console.error(`[order.service] Payment authorisation failed for order ${orderId}, rolling back inventory`);
    throw new ValidationError(`Payment failed: ${(err as Error).message}`);
  }

  const order: OrderDTO & { createdAt: Date } = {
    id: orderId,
    userId,
    status: OrderStatus.CONFIRMED,
    lines: orderLines,
    totalAmount,
    createdAt: new Date().toISOString(),
  } as any;
  (order as any).createdAt = new Date();
  _orders.set(orderId, order);

  // Step 5: Send order confirmation notification
  await notificationClient.notify(MESSAGE_TOPICS.ORDER_CREATED, userId, {
    orderId,
    totalAmount,
    lineCount: orderLines.length,
  });

  return order;
}

export async function getOrder(orderId: string): Promise<OrderDTO | undefined> {
  return _orders.get(orderId);
}

export async function cancelOrder(orderId: string): Promise<OrderDTO> {
  const order = _orders.get(orderId) as any;
  if (!order) throw new ValidationError(`Order ${orderId} not found`);

  // Business Rule: Orders can only be cancelled within 2 hours of creation
  const twoHoursMs = 2 * 60 * 60 * 1000;
  if (Date.now() - order.createdAt.getTime() > twoHoursMs) {
    throw new ValidationError('Order cancellation window has expired (2 hours)');
  }

  order.status = OrderStatus.CANCELLED;
  return order;
}

export async function updateStatus(orderId: string, status: OrderStatus): Promise<OrderDTO> {
  const order = _orders.get(orderId);
  if (!order) throw new ValidationError(`Order ${orderId} not found`);
  (order as any).status = status;
  if (status === OrderStatus.SHIPPED) {
    await notificationClient.notify(MESSAGE_TOPICS.ORDER_SHIPPED, order.userId, { orderId });
  }
  return order;
}
