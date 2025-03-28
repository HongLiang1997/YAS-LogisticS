import { Badge, Button, Card, Group, Image, List, Text } from "@mantine/core";
import bayImage from '@/images/bay.jpg';
import Bay from "@/models/bay";
import { modals } from '@mantine/modals';

interface BayCardProps {
  bay: Bay;
  classroomIsClosed: boolean;
}

function popupConfirmDeleteBayModal() {
  modals.openConfirmModal({
    title: 'Delete the bay',
    centered: true,
    children: (
      <>
        <Text size="sm">
          Are you sure you want to delete the bay?
        </Text>
        <Text size="sm">
          This action will delete any tray within the bay as well.
        </Text>
      </>
    ),
    labels: { confirm: 'Delete Bay', cancel: "No don't delete it" },
    confirmProps: { color: 'red' },
    onCancel: () => console.log('Cancel'),
    onConfirm: () => console.log('Confirmed'),
  });
}

function TrayStatusBadge(bay: Bay) {
  if (bay.tray === null) {
    return <Badge color="blue">LOANED</Badge>;
  }

  return <Badge color="pink">IN BAY</Badge>;
}

export function BayCard({ bay, classroomIsClosed }: BayCardProps) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        <Image src={bayImage} height={160} alt="Bay Image" />
      </Card.Section>

      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500}>{bay.id}</Text>
        {TrayStatusBadge(bay)}
      </Group>

      {
        /* No tray in bay */
        bay.tray == null &&
        <Text size="sm" c="dimmed">
          No tray are inside this bay...
        </Text>
      }

      {
        /* Tray inside bay, show the items */
        bay.tray != null &&
        <>
          <Text size="lg" fw={700}>Items: </Text>
          <List>
            {
              bay.tray.items.map((item) =>
                <List.Item key={item.id}>{item.name}</List.Item>
              )
            }
          </List>
        </>
      }

      {/* Edit Button followed by delete button */}
      <Group justify="space-between" mt="md" mb="xs">
        <Button
          color="blue"
          fullWidth mt="md"
          radius="md"
          disabled={!classroomIsClosed || bay.tray == null}
        >
          Edit Tray
        </Button>

        <Button
          color="blue"
          fullWidth mt="md"
          radius="md"
          disabled={!classroomIsClosed || bay.tray == null}
        >
          Delete Bay
        </Button>

      </Group>
      {
        !classroomIsClosed &&
          <Text size="sm" c="dimmed">Edits are denied for open classrooms!</Text>
      }
    </Card>
  );
}