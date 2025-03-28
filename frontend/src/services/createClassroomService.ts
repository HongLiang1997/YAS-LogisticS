import Cookies from 'js-cookie';
import { API_URL } from '@/consts';

/**
 *
 * @param name
 * @return The new classroom ID if success
 */
export default async function createClassroomService(name: string): Promise<number | null> {
  const targetURL = `${API_URL}/api/admin/classroom/create`;
  const sessionToken = Cookies.get('token')!;

  try {
    const response = await fetch(targetURL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
      body: JSON.stringify({
        name,
      }),
    });

    if (response.status === 401) {
      Cookies.remove('token');
      return null;
    }

    return parseInt(await response.text(), 10);
  } catch (err: any) {
    console.error(err);
    return null;
  }
}