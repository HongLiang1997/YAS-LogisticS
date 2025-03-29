import { useState } from "react";
import { IconBackspaceFilled, IconCirclePlus } from "@tabler/icons-react";
import {
  ActionIcon,
  Badge,
  Button,
  Card, Divider,
  Group,
  Image,
  List, Modal,
  Space,
  Text,
  TextInput,
} from '@mantine/core';
import { modals } from "@mantine/modals";
import trayImage from '../images/tray.jpg';
import Tray from '@/models/tray';
import editTrayService from "@/services/editTrayService";
import deleteBayService from "@/services/deleteBayService";
import {useDisclosure} from "@mantine/hooks";


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
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [itemNames, setItemNames] = useState<string[]>([]);

  const [currentEditingBayID, setCurrentEditingBayID] = useState<number>(-1);
  const [opened, { open, close }] = useDisclosure(false);

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

  /**
   * Popup a Modal with Modal Manager, asking to confirm delete.
   *
   * On confirm delete, call API server then refresh page.
   * @param targetBayID
   */
  const popupConfirmDeleteBayModal = (targetBayID: number) => {
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


  return (
    <>
      { /* Edit tray Modal */ }
      <Modal opened={opened} onClose={close} title="Edit Tray">
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
                  <>
                    <TextInput
                      key={index}
                      leftSectionPointerEvents="none"
                      rightSection={deleteCurrentItemActionButton}
                      description="Item Name"
                      value={itemName}
                      onChange={(event) => handleItemNameChange(index, event.currentTarget.value)}
                    />
                    <Space h="xs" />
                  </>
                );
              })
            }

            <Space h="xs" />

            {/* Button to add new item */}
            <Button
              rightSection={<IconCirclePlus size={14} />}
              onClick={() => handleAddItem()}
            >
              Add Item
            </Button>

            <Space h="md" />
            <Divider my="md" />

            <Group justify="center" grow>
              <Button
                variant="filled"
                size="md"
                radius="md"
                onClick={() => modals.closeAll()}
                disabled={buttonDisabled}
                color='gray'
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
                    editTrayService(currentEditingBayID, itemNames).then(_ => window.location.reload())
                  }
                }
                loading={isLoading}
              >
                Confirm
              </Button>
            </Group>
          </>
      </Modal>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section>
          <Image src={trayImage} height={160} alt="Bay Image" />
        </Card.Section>

        <Group justify="space-between" mt="md" mb="xs">
          <Text fw={500} c='indigo'>ID: {tray.id}</Text>
          {TrayStatusBadge(tray)}
        </Group>

        {
          /* Show the items inside the tray */
          tray.items.length >= 1 &&
          <>
            <Text size="lg" fw={700}>Items: </Text>
            <List>
              {
                tray.items.map((item) =>
                  <List.Item key={item.id}>{item.name}</List.Item>
                )
              }
            </List>
          </>
        }

        {
          /* No items configured for the tray...*/
          tray.items.length <= 0 &&
          <Text size="lg" fw={700} c='pink'>No Items configured for this tray!</Text>
        }

        {/* Edit Button followed by delete button */}
        <Group justify="space-between" mt="md" mb="xs">
          <Button
            color="blue"
            fullWidth mt="md"
            radius="md"
            disabled={!classroomIsClosed || tray.bayID == null}
            onClick={() => {
              setItemNames(tray.items.map((item) => item.name))
              setCurrentEditingBayID(tray.bayID!)
              open()
            }}
          >
            Edit Tray
          </Button>

          <Button
            color="red"
            fullWidth mt="md"
            radius="md"
            disabled={!classroomIsClosed || tray.bayID == null}
            onClick={() => popupConfirmDeleteBayModal(tray.bayID!)}
          >
            Delete Bay
          </Button>

        </Group>

        {
          !classroomIsClosed &&
            <Text size="sm" c="dimmed">Edits are denied for open classrooms!</Text>
        }

        {
          tray.bayID == null &&
            <Text size="sm" c="dimmed">Tray needs to be docked to be edited!</Text>
        }
      </Card>
    </>
  );
}