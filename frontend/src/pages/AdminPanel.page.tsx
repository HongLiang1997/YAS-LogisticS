import { useEffect, useState } from 'react';
import {AppShell, Group, Button, Modal, TextInput, Space} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { ClassroomsView } from '@/components/adminpage/ClassroomsView';
import { AdminHeader } from '@/components/nav/AdminHeader';
import { ClassroomStatus } from '@/enums/ClassroomStatus';
import Classroom from '@/models/classroom';
import createClassroomService from '@/services/createClassroomService';
import getClassroomsService from '@/services/getClassroomsService';
import redirectIfFailAuth from '@/utils/redirectIfFailAuth';


export function AdminPanelPage() {

  const [classrooms, setClassrooms] = useState<Classroom[]>([]);

  const [buttonIsDisabled, setButtonIsDisabled] = useState(false);
  const [buttonIsLoading, setButtonIsLoading] = useState(false);
  const [newClassroomName, setNewClassroomName] = useState('');

  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    const redirected = redirectIfFailAuth();
    if (redirected) {
      return;
    }

    getClassroomsService().then((classrooms) => {
      if (classrooms == null) {
        notifications.show({
          title: 'API Failure',
          message: 'Failed to load classrooms! Try again later.',
          color: 'red',
        });
        return;
      }

      setClassrooms(classrooms);
    });
  }, []);

  /**
   * Popup a modal to ask for classroom name before creation.
   */
  const confirmCreateClassroom = () => {
    if (buttonIsLoading) {
      return;
    }

    setButtonIsDisabled(true);
    setButtonIsLoading(true);
    // API Request; After getting result, notification and close popup modal.
    createClassroomService(newClassroomName).then((result) => {
      setButtonIsLoading(false);
      setButtonIsDisabled(false);

      if (result == null) {
        notifications.show({
          title: 'Failed to create classroom!',
          message: 'Failed to create classroom! Try again later!',
          color: 'red',
        });
        return;
      }

      // Append new classroom with ID
      setClassrooms([
        ...classrooms,
        {
          id: result,
          name: newClassroomName,
          status: ClassroomStatus.CLOSED,
          bays: [],
          trays: []
        },
      ]);

      notifications.show({
        title: 'Created new classroom.',
        message: `Successfully created classroom ${newClassroomName}`,
        color: 'blue',
      });
      setNewClassroomName('');
      close();
    });
  }

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AdminHeader/>

      <AppShell.Main>
        <Modal opened={opened} onClose={close} title="Create CLassroom">
          <TextInput
            size="md"
            radius="md"
            label="Classroom Name"
            placeholder="New Classroom Name Here"
            value={newClassroomName}
            onChange={(event) => setNewClassroomName(event.target.value)}
          />

          <Space h="md"/>

          <Group>
           <Button
             color='gray'
             disabled={buttonIsDisabled}
           >
             Cancel
           </Button>

            <Button
              color='green'
              loading={buttonIsLoading}
              onClick={confirmCreateClassroom}
            >
              Create Classroom
            </Button>
          </Group>
        </Modal>

        <ClassroomsView
          classrooms={classrooms}
          onRequestCreateClassroom={() => open()}
        />
      </AppShell.Main>
    </AppShell>
  );
}
