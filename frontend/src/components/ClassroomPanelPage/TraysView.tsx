import Tray from "@/models/tray";
import {TrayCard} from "@/components/ClassroomPanelPage/TrayCard";
import {SimpleGrid} from "@mantine/core";

interface TraysViewProps {
  trays: Tray[];
  classroomIsClosed: boolean;
}

export function TraysView({trays, classroomIsClosed}: TraysViewProps) {
  return (
    <SimpleGrid cols={2} spacing="xl">
      {
        trays.map((tray: Tray) =>
          <TrayCard key={tray.id} tray={tray} classroomIsClosed={classroomIsClosed} />
        )
      }
    </SimpleGrid>
  )
}