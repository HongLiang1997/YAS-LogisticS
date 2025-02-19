import { AppShell, NavLink } from '@mantine/core';
import { IconGraph, IconLogout2, IconFilePlus, IconTableShortcut } from '@tabler/icons-react';

interface AdminNavbarProps {
    activePage: string;
    setActivePage: (page: string) => void;
}

export function AdminNavbar({ activePage, setActivePage }: AdminNavbarProps) {
    return (
        <AppShell.Navbar p="md">
            <NavLink
                label="Overview"
                leftSection={<IconGraph size={30} stroke={1.5} />}
                active={activePage === 'overview'}
                onClick={() => setActivePage('overview')}
            />
            <NavLink
                label="Basket Logs"
                leftSection={<IconTableShortcut size={30} stroke={1.5} />}
                active={activePage === 'logs'}  // Check this value ('logs' should be the same as in the condition)
                onClick={() => setActivePage('logs')}  // Update activePage to 'logs' when clicked
            />
            <NavLink
                label="Request Equipment"
                leftSection={<IconFilePlus size={30} stroke={1.5} />}
                active={activePage === 'request'}
                onClick={() => setActivePage('request')}
            />
            <NavLink
                label="Logout"
                leftSection={<IconLogout2 size={30} stroke={1.5} color="red" />}
                onClick={() => alert('Logging out...')}
                styles={{ label: { color: 'red' } }}
            />
        </AppShell.Navbar>
    );
}
