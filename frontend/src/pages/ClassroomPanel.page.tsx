import { useEffect, useState } from 'react';
import { IconBlocks, IconTir } from '@tabler/icons-react';
import { AppShell, Button, Space, Tabs, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { BayViews } from '@/components/ClassroomPanelPage/BaysView';
import { TraysView } from '@/components/ClassroomPanelPage/TraysView';
import LoadingView from '@/components/LoadingView';
import { AdminHeader } from '@/components/nav/AdminHeader';
import { ClassroomStatus } from '@/enums/ClassroomStatus';
import Classroom from '@/models/classroom';
import editClassroomStatusService from '@/services/editClassroomStatusService';
import getClassroomsService from '@/services/getClassroomsService';
import redirectIfFailAuth from '@/utils/redirectIfFailAuth';
import redirectWithDelay from '@/utils/redirectWithDelay';
import {StatisticsView} from "@/components/ClassroomPanelPage/StatisticsView";

export function ClassroomPanelPage() {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const [classroom, setClassroom] = useState<Classroom>();
  const [buttonIsLoading, setButtonIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const redirected = redirectIfFailAuth();
    if (redirected) {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const numericId = id ? Number(id) : null;

    if (numericId == null) {
      notifications.show({
        title: 'No classroom specified',
        message: 'An error occurred, redirecting back to admin panel.',
        color: 'red',
      });
      redirectWithDelay('/adminpanel');
      return;
    }

    // Load all classrooms
    getClassroomsService().then((classrooms) => {
      if (classrooms == null) {
        // Failure to load.
        notifications.show({
          title: 'API Failure',
          message: 'Failed to load classrooms! Try again later.',
          color: 'red',
        });
        return;
      }

      // Find first matching classroom based on query URL.
      const matchingClassroom = classrooms.find((classroom) => {
        return classroom.id === numericId;
      });

      if (matchingClassroom === undefined) {
        // Failure to find (Bad query ID?)
        notifications.show({
          title: 'Missing Classroom',
          message: 'An error occurred, redirecting back to admin panel.',
          color: 'red',
        });
        redirectWithDelay('/adminpanel');
        return;
      }

      setClassroom(matchingClassroom);
    });
  }, []);

  /**
   * Send to API Server to change classroom status.
   *
   * Will trigger button into loading state when getting back success from API server.
   * Displays notification dynamically based on API server success/failure, and if open or closing classroom.
   * @param newStatus
   */
  const changeClassroomStatus = async (newStatus: ClassroomStatus) => {
    if (classroom == null || buttonIsLoading == null) {
      return;
    }

    setButtonIsLoading(true);
    const isSuccess = await editClassroomStatusService(classroom.id, classroom.name, newStatus);
    setButtonIsLoading(false);

    if (!isSuccess) {
      notifications.show({
        color: 'red',
        title: 'Failure!',
        message: 'Failed to change classroom status! Try again later.',
      });
      return;
    }

    let message = 'Classroom is now open for students to loan!';
    if (newStatus === ClassroomStatus.CLOSED) {
      message = 'Classroom is now closed!';
    }

    notifications.show({
      color: 'blue',
      title: 'Success!',
      message,
    });

    const updatedClassroom = { ...classroom, status: newStatus };
    setClassroom(updatedClassroom);
  };

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AdminHeader
        mobileOpened={mobileOpened}
        toggleMobile={toggleMobile}
        desktopOpened={desktopOpened}
        toggleDesktop={toggleDesktop}
      />

      <AppShell.Main>
        {
          /* Still loading classroom */
          classroom === undefined && <LoadingView skeletonCount={15} />
        }

        {
          // Classroom is Open
          classroom !== undefined && classroom.status === ClassroomStatus.OPEN &&
          (
            <>
              <Text fw={700} size="xl">
                Classroom is Open for students
              </Text>
              <Text c="dimmed">Open classroom cannot be edited!</Text>
              <Space />
              <Button
                variant="filled"
                size="md"
                radius="md"
                loading={buttonIsLoading}
                onClick={() => changeClassroomStatus(ClassroomStatus.CLOSED)}
              >
                Close Classroom
              </Button>
            </>
          )
        }

        {
          // Classroom is Closed
          classroom !== undefined && classroom.status === ClassroomStatus.CLOSED &&
          (
            <>
              <Text fw={700} size="xl">
                Classroom is Closed for students
              </Text>
              <Space />
              <Button
                variant="filled"
                size="md"
                radius="md"
                loading={buttonIsLoading}
                onClick={() => changeClassroomStatus(ClassroomStatus.OPEN)}
              >
                Open Classroom
              </Button>
            </>
          )
        }

        <Space />
        {classroom !== undefined && (
          <Tabs variant="outline" radius="md" defaultValue="gallery">
            <Tabs.List>
              <Tabs.Tab value="bays" leftSection={<IconBlocks size={12} />}>
                Bays
              </Tabs.Tab>
              <Tabs.Tab value="trays" leftSection={<IconTir size={12} />}>
                Trays
              </Tabs.Tab>
              <Tabs.Tab value="statistics" leftSection={<IconTir size={12} />}>
                Statistics
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="bays">
              <BayViews
                bays={classroom.bays}
                classroomIsClosed={classroom.status === ClassroomStatus.CLOSED}
              />
            </Tabs.Panel>

            <Tabs.Panel value="trays">
              <TraysView
                trays={classroom.trays}
                classroomIsClosed={classroom.status === ClassroomStatus.CLOSED}
              />
            </Tabs.Panel>

            <Tabs.Panel value="statistics">
              <StatisticsView classroom={classroom} />
            </Tabs.Panel>
          </Tabs>
        )}
      </AppShell.Main>
    </AppShell>
  );
}