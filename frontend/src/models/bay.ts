import Tray from "@/models/tray";

export default interface Bay {
  id: number;
  tray: Tray | null;
}