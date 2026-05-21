import { notify } from '../clients/notificationClient';
import { MESSAGE_TOPICS } from '@indoor-fish/shared-libs';

export async function publishOrderShipped(userId: string, orderId: string): Promise<void> {
  await notify(MESSAGE_TOPICS.ORDER_SHIPPED, userId, { orderId });
}
