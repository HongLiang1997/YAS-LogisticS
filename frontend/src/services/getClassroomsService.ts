import Cookies from 'js-cookie';
import { API_URL } from '@/consts';
import Classroom from '@/models/classroom';

export default async function getClassroomsService(): Promise<Classroom[] | null> {
  const targetURL = `${API_URL}/api/admin/classroom`;
  const sessionToken = Cookies.get('token')!;

  try {
    const response = await fetch(targetURL, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    });

    if (response.status === 401) {
      Cookies.remove('token');
      return null;
    }

    const data = await response.json();
    return data.classrooms;
  } catch (err: any) {
    console.error(err);
    return null;
  }
}