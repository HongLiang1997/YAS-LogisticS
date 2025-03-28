import { Badge, Button, Card, Group, Image, Text } from '@mantine/core';
import { ClassroomStatus } from '@/enums/ClassroomStatus';
import classroomImage from '@/images/classroom.jpg';
import Classroom from '@/models/classroom';

interface ClassroomCardProps {
  classroom: Classroom;
}

function ClassroomStatusBadge(classroomStatus: ClassroomStatus) {
  if (classroomStatus === ClassroomStatus.CLOSED) {
    return <Badge color="blue">CLOSED</Badge>;
  }

  return <Badge color="pink">OPEN</Badge>;
}

export function ClassroomCard({ classroom }: ClassroomCardProps) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        <Image src={classroomImage} height={160} alt="Classroom Image" />
      </Card.Section>

      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500}>{classroom.name}</Text>
        {ClassroomStatusBadge(classroom.status)}
      </Group>

      <Text size="sm" c="dimmed">
        Number of trays: {classroom.trays.length}
      </Text>

      <Button color="blue" fullWidth mt="md" radius="md">
        Overview
      </Button>

      {
        classroom.status === ClassroomStatus.OPEN &&
        <Text size="sm" c="dimmed">Open classroom cant be edited!</Text>
      }
    </Card>
  );
}