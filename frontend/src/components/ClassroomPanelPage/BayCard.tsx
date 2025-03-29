import {TextInput, Badge, Button, Card, Group, Image, List, Text, ActionIcon, Space} from "@mantine/core";
import bayImage from '@/images/bay.jpg';
import Bay from "@/models/bay";
import { modals } from '@mantine/modals';
import deleteBayService from "@/services/deleteBayService";
import {IconBackspaceFilled, IconCirclePlus} from "@tabler/icons-react";
import {useState} from "react";
import editTrayService from "@/services/editTrayService";

interface BayCardProps {
  bay: Bay;
  classroomIsClosed: boolean;
}

/**
 * Popup Modal to edit a tray that is inside a bay.
 *
 * Has a list of text field to edit and delete existing item names.
 * Button to add more item.
 *
 * Cancel and Confirm button; Refresh page after sent API request on confirm.
 * @param targetBayID
 * @param existingItemNames
 */
function popupEditTrayModal(targetBayID: number, existingItemNames: string[]) {
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [itemNames, setItemNames] = useState(existingItemNames);

  const handleItemNameChange = (index: number, newName: string) => {
    const updatedItemNames = [...itemNames];
    updatedItemNames[index] = newName;
    setItemNames(updatedItemNames);
  };

  const handleDeleteItem = (index: number) => {
    const updatedItemNames = itemNames.filter((_, i) => i !== index);
    setItemNames(updatedItemNames);
  };

  const handleAddItem = () => {
    setItemNames([...itemNames, 'new item']);
  };

  modals.open({
    title: 'Edit Tray Items',
    children: (
      <>
        {
          // Display all item names as a list of text input, with action button to delete the current item...
          itemNames.map((itemName, index) => {
            const deleteCurrentItemActionButton = (
              <ActionIcon
                variant="subtle"
                color="pink"
                aria-label="Delete Item"
                onClick={() => handleDeleteItem(index)}
              >
                <IconBackspaceFilled style={{ width: '70%', height: '70%' }} stroke={1.5} />
              </ActionIcon>
            );

            return (
              <TextInput
                key={index}
                leftSectionPointerEvents="none"
                rightSection={deleteCurrentItemActionButton}
                description="Item Name"
                value={itemName}
                onChange={(event) => handleItemNameChange(index, event.currentTarget.value)}
              />
            );
          })
        }

        {/* Button to add new item */}
        <Button
          rightSection={<IconCirclePlus size={14} />}
          onClick={() => handleAddItem()}
        >
          Add Item
        </Button>

        <Space h="md" />

        <Group justify="center" grow>
          <Button
            variant="filled"
            size="md"
            radius="md"
            onClick={() => modals.closeAll()}
            disabled={buttonDisabled}
          >
            Cancel
          </Button>

          <Button
            variant="filled"
            color="green"
            size="md"
            radius="md"
            onClick={
              () => {
                if (buttonDisabled) {
                  return;
                }

                setIsLoading(true)
                setButtonDisabled(true)
                editTrayService(targetBayID, itemNames).then(_ => window.location.reload())
              }
            }
            loading={isLoading}
          >
            Confirm
          </Button>
        </Group>
      </>
    ),
  });
}

/**
 * Popup a Modal with Modal Manager, asking to confirm delete.
 *
 * On confirm delete, call API server then refresh page.
 * @param targetBayID
 */
function popupConfirmDeleteBayModal(targetBayID: number) {
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  modals.openConfirmModal({
    title: `Delete Bay ${targetBayID}`,
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
    cancelProps: { disabled: buttonDisabled },
    confirmProps: { color: 'red', loading: isLoading },
    onCancel: () => modals.closeAll(),
    // Delete and then refresh page
    onConfirm: () =>  {
      if (buttonDisabled) {
        return;
      }

      setIsLoading(true);
      setButtonDisabled(true);
      deleteBayService(targetBayID).then(_ => window.location.reload())
    },
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
          onClick={() => popupEditTrayModal(bay.id, bay.tray!.items.map(item => item.name))}
        >
          Edit Tray
        </Button>

        <Button
          color="red"
          fullWidth mt="md"
          radius="md"
          disabled={!classroomIsClosed || bay.tray == null}
          onClick={() => popupConfirmDeleteBayModal(bay.id)}
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