import { notify } from '../clients/notificationClient';
import { MESSAGE_TOPICS } from '@indoor-fish/shared-libs';

export async function publishOrderCreated(userId: string, orderId: string, amount: number): Promise<void> {
  await notify(MESSAGE_TOPICS.ORDER_CREATED, userId, { orderId, amount });
}
