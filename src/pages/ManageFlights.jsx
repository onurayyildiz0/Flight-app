import React, { useState, useEffect } from 'react';
import { Table, Button, message } from 'antd';
import { getFlights, deleteFlight } from '../services/flightService';

function ManageFlights() {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Uçuşları API'den al
        const fetchFlights = async () => {
            setLoading(true);
            try {
                const data = await getFlights();
                setFlights(data);
            } catch (error) {
                message.error('An error occurred while fetching flights.');
            } finally {
                setLoading(false);
            }
        };

        fetchFlights();
    }, []);

    const handleDelete = async (rowId) => {
        try {
            await deleteFlight(rowId);
            message.success('Flight deleted successfully!');
            // Uçuş listesini güncelle
            setFlights(flights.filter((flight) => flight.id !== rowId));
        } catch (error) {
            message.error('An error occurred while deleting the flight.');
        }
    };

    const columns = [
        {
            title: 'Departure',
            dataIndex: 'departure',
            key: 'departure',
        },
        {
            title: 'Arrival',
            dataIndex: 'arrival',
            key: 'arrival',
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: 'Airline',
            dataIndex: 'airline',
            key: 'airline',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Duration',
            dataIndex: 'duration',
            key: 'duration',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Button
                    type="text"
                    danger
                    onClick={() => handleDelete(record.id)}
                >
                    Delete
                </Button>
            ),
        },
    ];

    return (
        <div>
            <h1>Manage Flights</h1>
            <Table
                dataSource={flights}
                columns={columns}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 5 }}
            />
        </div>
    );
}

export default ManageFlights;