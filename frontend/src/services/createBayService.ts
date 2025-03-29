import {API_URL} from "@/consts";
import Cookies from "js-cookie";

/**
 *
 * @param classroomID
 * @return The new Bay ID if success
 */
export default async function createBayService(
  classroomID: number,
): Promise<number | null> {
  const targetURL = `${API_URL}/api/admin/tray/create`;
  const sessionToken = Cookies.get('token')!;

  try {
    const response = await fetch(targetURL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        classroomID
      })
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