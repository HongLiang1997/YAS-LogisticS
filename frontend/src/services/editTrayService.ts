import {API_URL} from "@/consts";
import Cookies from "js-cookie";

export default async function editTrayService(
  bayID: number,
  itemNames: string[]
): Promise<boolean> {
  const targetURL = `${API_URL}/api/admin/edit/tray`;
  const sessionToken = Cookies.get('token')!;

  try {
    const response = await fetch(targetURL, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
      body: JSON.stringify({
        id: bayID,
        itemNames
      })
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