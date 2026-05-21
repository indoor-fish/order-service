import axios from 'axios';
import { SERVICE_URLS, UserDTO } from '@indoor-fish/shared-libs';

export async function getUser(userId: string): Promise<UserDTO> {
  const res = await axios.get(`${SERVICE_URLS.USER_SERVICE_URL}/users/${userId}`);
  return res.data as UserDTO;
}
