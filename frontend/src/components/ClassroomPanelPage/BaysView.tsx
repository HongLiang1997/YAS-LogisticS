import {Button, SimpleGrid} from "@mantine/core";
import {IconPlus} from "@tabler/icons-react";
import Bay from "@/models/bay";
import {BayCard} from "@/components/ClassroomPanelPage/BayCard";

interface BaysViewProps {
  bays: Bay[];
  classroomIsClosed: boolean;
}

/**
 * Simple Grid view of all bays for a classroom.
 * @constructor
 */
export function BayViews({ bays, classroomIsClosed }: BaysViewProps) {
  return (
    <SimpleGrid cols={2} spacing="xl">
      {
        bays.map((bay: Bay) =>
          <BayCard key={bay.id} bay={bay} classroomIsClosed={classroomIsClosed} />
        )
      }

      {/* Button to trigger creating a new bay */}
      <Button
        size="md"
        rightSection={<IconPlus size={16}/>}
      >
        Add Bay
      </Button>
    </SimpleGrid>
  )
}