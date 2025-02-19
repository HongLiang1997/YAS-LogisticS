import { AppShell, Burger, Group, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ColorSchemeToggle } from '../ColorScheme/ColorSchemeToggle';
import Logo from '../images/yas_logistics_icon.svg';  // Adjust the path based on your folder structure

interface AdminHeaderProps {
    mobileOpened: boolean;
    toggleMobile: () => void;
    desktopOpened: boolean;
    toggleDesktop: () => void;
}

export function AdminHeader({ mobileOpened, toggleMobile, desktopOpened, toggleDesktop }: AdminHeaderProps) {
    return (
        <AppShell.Header>
            <Group h="100%" px="md" justify="space-between">
                <Group>
                    <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
                    <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom="sm" size="sm" />
                    <Text size="lg" fw={700}>YAS Logistics</Text>
                </Group>
                <ColorSchemeToggle />
            </Group>
        </AppShell.Header>
    );
}
