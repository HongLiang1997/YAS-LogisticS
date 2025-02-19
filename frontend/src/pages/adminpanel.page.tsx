import { useState } from 'react';
import { AppShell } from '@mantine/core';
import { AdminHeader } from '../components/nav/AdminHeader';
import { AdminNavbar } from '../components/nav/AdminNavbar';
import { Overview } from '../components/adminpage/Overview';
import { EquipmentRequestForm } from '../components/adminpage/EquipmentRequestForm';
import { BasketLogs } from '../components/adminpage/BasketLogs';
import { useDisclosure } from '@mantine/hooks';

export function AdminPanelPage() {
    const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
    const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
    const [activePage, setActivePage] = useState('overview');  // Default to 'overview'

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{
                width: 300,
                breakpoint: 'sm',
                collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
            }}
            padding="md">

            <AdminHeader
                mobileOpened={mobileOpened}
                toggleMobile={toggleMobile}
                desktopOpened={desktopOpened}
                toggleDesktop={toggleDesktop}
            />

            <AdminNavbar activePage={activePage} setActivePage={setActivePage} />

            <AppShell.Main>
                {activePage === 'overview'
                    ? <Overview />
                    : activePage === 'logs'
                        ? <BasketLogs />
                        : <EquipmentRequestForm />}
            </AppShell.Main>
        </AppShell>
    );
}
