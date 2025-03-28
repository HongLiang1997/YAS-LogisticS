import {useDisclosure} from "@mantine/hooks";
import {useEffect, useState} from "react";
import redirectIfFailAuth from "@/utils/redirectIfFailAuth";
import {AppShell} from "@mantine/core";
import {AdminHeader} from "@/components/nav/AdminHeader";
import {AdminNavbar} from "@/components/nav/AdminNavbar";
import {Overview} from "@/components/adminpage/Overview";
import {BasketLogs} from "@/components/adminpage/BasketLogs";
import {EquipmentRequestForm} from "@/components/adminpage/EquipmentRequestForm";
import getClassroomsService from "@/services/getClassroomsService";
import {notifications} from "@mantine/notifications";
import redirectWithDelay from "@/utils/redirectWithDelay";
import Classroom from "@/models/classroom";
import LoadingView from "@/components/LoadingView";

export function ClassroomPanelPage() {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const [classroom, setClassroom] = useState<Classroom>();

  useEffect(() => {
    const redirected = redirectIfFailAuth()
    if (redirected) {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const numericId = id ? Number(id) : null;

    if (numericId == null) {
      notifications.show({
        title: "No classroom specified",
        message: "An error occurred, redirecting back to admin panel.",
        color: 'red'
      })
      redirectWithDelay("/adminpanel")
      return;
    }

    // Load all classrooms
    getClassroomsService().then(classrooms => {
      if (classrooms == null) {
        // Failure to load.
        notifications.show({
          title: "API Failure",
          message: "Failed to load classrooms! Try again later.",
          color: 'red'
        })
        return;
      }

      // Find first matching classroom based on query URL.
      const matchingClassroom = classrooms.find(classroom => {
        return classroom.id === numericId;
      })

      if (matchingClassroom === undefined) {
        // Failure to find (Bad query ID?)
        notifications.show({
          title: "Missing Classroom",
          message: "An error occurred, redirecting back to admin panel.",
          color: 'red'
        })
        redirectWithDelay("/adminpanel")
        return;
      }

      setClassroom(matchingClassroom);
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
        {
          /* Still loading classroom */
          classroom === undefined &&
          <LoadingView skeletonCount={15}/>
        }

      </AppShell.Main>
    </AppShell>
  );
}