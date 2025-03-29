import {ActionIcon, AppShell, Group, Text} from '@mantine/core';
import { ColorSchemeToggle } from '../ColorScheme/ColorSchemeToggle';
import {IconHome} from "@tabler/icons-react";
import redirectWithDelay from "@/utils/redirectWithDelay";  // Adjust the path based on your folder structure

export function AdminHeader() {
    return (
        <AppShell.Header>
            <Group h="100%" px="md" justify="space-between">
                <Group>
                    <Text size="lg" fw={700}>YAS Logistics</Text>

                    <ActionIcon variant="subtle" size="xl" radius="md" aria-label="Home"
                      onClick={() => {
                        redirectWithDelay("/adminpanel", 0)
                      }}
                    >
                      <IconHome style={{ width: '70%', height: '70%' }} stroke={1.5} />
                    </ActionIcon>
                </Group>
                <ColorSchemeToggle />
            </Group>
        </AppShell.Header>
    );
}
