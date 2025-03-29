import {API_URL} from "@/consts";
import Cookies from "js-cookie";
import {ClassroomStatus} from "@/enums/ClassroomStatus";

export default async function editClassroomStatusService(
  classroomID: number,
  classroomName: string,
  classroomStatus: ClassroomStatus
): Promise<boolean> {
  const targetURL = `${API_URL}/api/admin/edit/classroom`;
  const sessionToken = Cookies.get('token')!;

  try {
    const response = await fetch(targetURL, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: classroomID,
        name: classroomName,
        status: classroomStatus.toString()
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