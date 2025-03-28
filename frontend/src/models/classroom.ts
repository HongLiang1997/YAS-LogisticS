import {ClassroomStatus} from "@/enums/ClassroomStatus";
import Bay from "@/models/bay";
import Tray from "@/models/tray";

export default interface Classroom {
  id: number;
  name: string;
  status: ClassroomStatus;
  bays: Bay[];
  trays: Tray[];
}