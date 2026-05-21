import axios from 'axios';
import { SERVICE_URLS, ProductDTO } from '@indoor-fish/shared-libs';

export async function getProduct(productId: string): Promise<ProductDTO> {
  const res = await axios.get(`${SERVICE_URLS.CATALOG_SERVICE_URL}/products/${productId}`);
  return res.data.product as ProductDTO;
}

export async function getPrice(productId: string, userRole: string, orderTotal: number): Promise<{ finalPrice: number; discountApplied: number }> {
  const res = await axios.get(`${SERVICE_URLS.CATALOG_SERVICE_URL}/products/${productId}/price`, {
    params: { user_role: userRole, order_total: orderTotal },
  });
  return { finalPrice: res.data.final_price, discountApplied: res.data.discount_applied };
}

export async function reserveInventory(productId: string, quantity: number): Promise<void> {
  await axios.patch(`${SERVICE_URLS.CATALOG_SERVICE_URL}/inventory/${productId}/reserve`, { quantity });
}
