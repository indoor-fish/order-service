import axios from 'axios';
import { SERVICE_URLS, PaymentDTO, PaymentStatus } from '@indoor-fish/shared-libs';

export async function authorisePayment(userId: string, orderId: string, amount: number): Promise<PaymentDTO> {
  const res = await axios.post(`${SERVICE_URLS.PAYMENT_SERVICE_URL}/payments/authorise`, {
    user_id: userId,
    order_id: orderId,
    amount,
    currency: 'USD',
  });
  return res.data.payment as PaymentDTO;
}

export async function capturePayment(paymentId: string): Promise<PaymentDTO> {
  const res = await axios.post(`${SERVICE_URLS.PAYMENT_SERVICE_URL}/payments/capture`, { payment_id: paymentId });
  return res.data.payment as PaymentDTO;
}
