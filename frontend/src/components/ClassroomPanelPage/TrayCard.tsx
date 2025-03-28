import {Badge, Button, Card, Group, Image, List, Text} from "@mantine/core";
import trayImage from "@/images/tray.jpg";
import Tray from "@/models/tray";

interface TrayCardProps {
  tray: Tray;
  classroomIsClosed: boolean;
}

function TrayStatusBadge(tray: Tray) {
  if (tray.bayID === null) {
    return <Badge color="blue">LOANED</Badge>;
  }

  return <Badge color="pink">IN BAY</Badge>;
}

export function TrayCard({ tray, classroomIsClosed }: TrayCardProps) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        <Image src={trayImage} height={160} alt="Bay Image" />
      </Card.Section>

      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500}>{tray.id}</Text>
        {TrayStatusBadge(tray)}
      </Group>

      <Text size="lg" fw={700}>Items: </Text>
      <List>

      {
        /* Show the items inside the tray */
        tray.items.map((item) =>
          <List.Item key={item.id}>{item.name}</List.Item>
        )
      }
      </List>

      <Button
        color="blue"
        fullWidth mt="md"
        radius="md"
        disabled={!classroomIsClosed || tray.bayID == null}
      >
        Edit Tray
      </Button>
      {
        !classroomIsClosed &&
          <Text size="sm" c="dimmed">Edits are denied for open classrooms!</Text>
      }
    </Card>
  );
}