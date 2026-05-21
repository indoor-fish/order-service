import axios from 'axios';
import { SERVICE_URLS, MESSAGE_TOPICS, NotificationChannel } from '@indoor-fish/shared-libs';

export async function notify(topic: string, userId: string, data: Record<string, unknown>): Promise<void> {
  try {
    await axios.post(
      `${SERVICE_URLS.NOTIFICATION_SERVICE_URL}/internal/notify`,
      { userId, topic, channel: NotificationChannel.EMAIL, data },
      { headers: { 'X-Internal-Service': 'order-service' } },
    );
  } catch (err) {
    console.error(`[notificationClient] Failed to send ${topic}:`, err);
  }
}
