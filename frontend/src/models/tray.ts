import Item from "@/models/item";

export default interface Tray {
  id: number;
  items: Item[];
  classroomID: number;
  classroomName: string;
  bayID: number | null;
}