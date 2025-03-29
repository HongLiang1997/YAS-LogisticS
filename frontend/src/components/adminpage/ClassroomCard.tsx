import { Badge, Button, Card, Group, Image, Text } from '@mantine/core';
import { ClassroomStatus } from '@/enums/ClassroomStatus';
import classroomImage from '../images/classroom.jpg';
import Classroom from '@/models/classroom';
import redirectWithDelay from "@/utils/redirectWithDelay";
import {modals} from "@mantine/modals";
import {useState} from "react";
import deleteClassroomService from "@/services/deleteClassroomService";

interface ClassroomCardProps {
  classroom: Classroom;
}

function navigateToClassroom(classroom: Classroom) {
  redirectWithDelay(`/classroom-panel?id=${classroom.id}`, 0);
}

function ClassroomStatusBadge(classroomStatus: ClassroomStatus) {
  if (classroomStatus === ClassroomStatus.CLOSED) {
    return <Badge color="blue">CLOSED</Badge>;
  }

  return <Badge color="pink">OPEN</Badge>;
}

export function ClassroomCard({ classroom }: ClassroomCardProps) {
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Popup a Modal with Modal Manager, asking to confirm delete.
   *
   * On confirm delete, call API server then refresh page.
   * @param targetBayID
   */
  const popupConfirmDeleteClassroomModal = (targetClassroomID: number, targetClassroomName: string) => {
    modals.openConfirmModal({
      title: `Delete Classroom ${targetClassroomName}`,
      centered: true,
      children: (
        <>
          <Text size="sm">
            Are you sure you want to delete the classroom?
          </Text>
          <Text size="sm" c='pink'>
            This action will delete all trays and bays within the classroom!
          </Text>
        </>
      ),
      labels: { confirm: 'Delete Classroom', cancel: "No don't delete it" },
      cancelProps: { disabled: buttonDisabled },
      confirmProps: { color: 'red', loading: isLoading },
      onCancel: () => modals.closeAll(),
      // Delete and then refresh page
      onConfirm: () =>  {
        if (buttonDisabled) {
          return;
        }

        setIsLoading(true);
        setButtonDisabled(true);
        deleteClassroomService(targetClassroomID).then(_ => window.location.reload())
      },
    });
  }


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

      <Button color="blue" fullWidth mt="md" radius="md" onClick={() => navigateToClassroom(classroom)}>
        Overview
      </Button>

      <Button color="pink" disabled={classroom.status === ClassroomStatus.OPEN} fullWidth mt="md" radius="md" onClick={() => popupConfirmDeleteClassroomModal(classroom.id, classroom.name)}>
        Delete
      </Button>

      {
        classroom.status === ClassroomStatus.OPEN &&
        <Text size="sm" c="dimmed">Open classroom cant be edited!</Text>
      }
    </Card>
  );
}