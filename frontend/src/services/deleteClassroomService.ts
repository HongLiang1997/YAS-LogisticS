import Cookies from 'js-cookie';
import { API_URL } from '@/consts';

export default async function deleteClassroomService(classroomID: number): Promise<boolean> {
  const targetURL = `${API_URL}/api/admin/classroom/${classroomID}`;
  const sessionToken = Cookies.get('token')!;

  try {
    const response = await fetch(targetURL, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    });

    if (response.status === 401) {
      Cookies.remove('token');
      return false;
    }

    return true;
  } catch (err: any) {
    console.error(err);
    return false;
  }
}