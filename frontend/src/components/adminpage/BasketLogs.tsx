import { Table, Button, Group, Collapse, useMantineTheme } from '@mantine/core'; // Assuming you're using Mantine's Table component
import React from 'react';
import { useState } from 'react';

// Dummy Data & Function //
//----------------------------------------------------------------------------------------------------//

// Type for Item
interface Item {
    name: string;
}

// Type for Tray
interface Tray {
    id: string;
    status: string;
    items: { [key: string]: number }; // Holds the items and their availability (0 or 1)
}

// Type for Classroom
interface Classroom {
    name: string;
    status: string;
    trays: Tray[];
}

// List of items
const items: Item[] = [
    { name: 'Raspberry Pi' },
    { name: 'Raspberry Pi Charger' },
    { name: 'HDMI Cable' },
    { name: 'SD Card Reader' },
];

// Function to generate random quantity between 1 and 10
function getRandomQuantity() {
    return Math.floor(Math.random() * 2); // 0 or 1
}

// Classroom Array with trays
const classrooms: Classroom[] = [
    {
        name: 'E6-05-01',
        status: 'Closed', // This classroom is closed, actions should be enabled
        trays: [
            { id: '01', status: 'In bay', items: {} },
            { id: '02', status: 'Loaned', items: {} },
        ],
    },
    {
        name: 'E6-07-02',
        status: 'Open', // This classroom is open, actions should be disabled
        trays: [
            { id: '03', status: 'In bay', items: {} },
            { id: '04', status: 'Loaned', items: {} },
        ],
    },
    {
        name: 'E6-07-07',
        status: 'Open', // This classroom is open, actions should be disabled
        trays: [
            { id: '03', status: 'In bay', items: {} },
            { id: '04', status: 'Loaned', items: {} },
        ],
    },
];

// Function to simulate assigning items to trays (0 or 1 of each item per tray)
function assignItemsToTrays(): void {
    classrooms.forEach(classroom => {
        classroom.trays.forEach(trayItem => {
            items.forEach(item => {
                // Randomly decide if this tray gets the item (0 or 1)
                trayItem.items[item.name] = Math.random() < 0.5 ? 1 : 0; // 50% chance to include the item
            });
        });
    });
}

// Function to simulate edit and delete actions
const handleEdit = (id: string) => {
    console.log(`Editing tray with ID: ${id}`);
    // Implement your edit logic here
};

const handleDelete = (id: string) => {
    console.log(`Deleting tray with ID: ${id}`);
    // Implement your delete logic here
};

assignItemsToTrays();

//----------------------------------------------------------------------------------------------------//
// End of Dummy Data & Function //
export function BasketLogs() {
    // State to track which classrooms are expanded
    const [openedClassrooms, setOpenedClassrooms] = useState<Set<string>>(new Set());

    const toggleClassroom = (classroomName: string) => {
        setOpenedClassrooms((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(classroomName)) {
                newSet.delete(classroomName); // Remove if already opened
            } else {
                newSet.add(classroomName); // Add if closed
            }
            return newSet;
        });
    };

    const rows = classrooms.map((classroom) => (
        <React.Fragment key={classroom.name}>
            {/* Classroom header section */}
            <div
                style={{
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    padding: '10px',
                }}
                onClick={() => toggleClassroom(classroom.name)}
            >
                {classroom.name} -{' '}
                <span style={{ color: classroom.status === 'Open' ? 'limegreen' : 'red' }}>
                    {classroom.status}
                </span>{' '}
                <span style={{ fontSize: '12px', color: '#888' }}>
                    (Click to {openedClassrooms.has(classroom.name) ? 'collapse' : 'expand'}){' '}
                </span>
                <span style={{ fontSize: '12px', color: '#888' }}>
                    - {classroom.trays.length} Tray{classroom.trays.length !== 1 ? 's' : ''}
                </span>
            </div>

            {/* Trays section */}
            <Collapse in={openedClassrooms.has(classroom.name)}>
                <Table style={{ marginBottom: '10px' }}>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Tray ID</Table.Th>
                            <Table.Th>Items</Table.Th>
                            <Table.Th>Status</Table.Th>
                            <Table.Th>Actions</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {classroom.trays.map((trayItem) => (
                            <Table.Tr key={trayItem.id}>
                                <Table.Td>{trayItem.id}</Table.Td>
                                <Table.Td>
                                    {items.map((item) => (
                                        <div key={item.name}>
                                            {item.name}: {trayItem.items[item.name] === 1 ? '1' : 'None'}
                                        </div>
                                    ))}
                                </Table.Td>
                                <Table.Td style={{ color: trayItem.status === 'Loaned' ? 'red' : 'limegreen' }}>
                                    {trayItem.status}
                                </Table.Td>
                                <Table.Td>
                                    <Group>
                                        <Button
                                            color="blue"
                                            onClick={() => handleEdit(trayItem.id)}
                                            size="xs"
                                            disabled={classroom.status === 'Open' || trayItem.status === 'Loaned'}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            color="red"
                                            onClick={() => handleDelete(trayItem.id)}
                                            size="xs"
                                            disabled={classroom.status === 'Open' || trayItem.status === 'Loaned'}
                                        >
                                            Delete
                                        </Button>
                                    </Group>
                                </Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
            </Collapse>
        </React.Fragment>
    ));

    return (
        <div>
            <h1>Basket Logs</h1>

            {/* Render all classrooms and their tray information */}
            {rows}
        </div>
    );
}