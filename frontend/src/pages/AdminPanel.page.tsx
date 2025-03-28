import { useEffect, useState } from 'react';
import { AppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { AdminHeader } from '@/components/nav/AdminHeader';
import redirectIfFailAuth from '@/utils/redirectIfFailAuth';
import Classroom from "@/models/classroom";
import getClassroomsService from "@/services/getClassroomsService";
import {notifications} from "@mantine/notifications";
import {ClassroomsView} from "@/components/adminpage/ClassroomsView";

export function AdminPanelPage() {
    const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
    const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

    const [classrooms, setClassrooms] = useState<Classroom[]>([]);

    useEffect(() => {
      const redirected = redirectIfFailAuth()
      if (redirected) {
        return;
      }

      getClassroomsService().then(classrooms => {
        if (classrooms == null) {
          notifications.show({
            title: "API Failure",
            message: "Failed to load classrooms! Try again later.",
            color: 'red'
          })
          return;
        }

        setClassrooms(classrooms);
      })
    }, []);

    return (
        <AppShell
            header={{ height: 60 }}
            padding="md">

            <AdminHeader
                mobileOpened={mobileOpened}
                toggleMobile={toggleMobile}
                desktopOpened={desktopOpened}
                toggleDesktop={toggleDesktop}
            />

            <AppShell.Main>
              <ClassroomsView classrooms={classrooms} />
            </AppShell.Main>
        </AppShell>
    );
}
