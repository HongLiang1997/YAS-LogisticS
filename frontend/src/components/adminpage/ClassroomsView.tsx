import {Button, SimpleGrid} from '@mantine/core';
import Classroom from '@/models/classroom';
import {ClassroomCard} from "@/components/adminpage/ClassroomCard";
import {IconPlus} from "@tabler/icons-react";


interface ClassroomsViewProps {
  classrooms: Classroom[];
  onRequestCreateClassroom: () => void;
}

/**
 * Simple Grid view of all classrooms.
 * @constructor
 */
export function ClassroomsView({ classrooms, onRequestCreateClassroom }: ClassroomsViewProps) {
  return (
    <SimpleGrid cols={2} spacing="xl">
      {
        classrooms.map((classroom: Classroom) =>
          <ClassroomCard key={classroom.id} classroom={classroom} />
        )
      }

      {/* Button to trigger creating a new classroom */}
      <Button
        size="md"
        rightSection={<IconPlus size={16}/>}
        onClick={() => onRequestCreateClassroom()}
      >
        Add Classroom
      </Button>
    </SimpleGrid>
  )
}