import React, { useState } from 'react';
import { Form, Input, Button, DatePicker, Select, message } from 'antd';
import { addFlight } from '../services/flightService';

const { Option } = Select;

function AddFlight() {
    const [seats, setSeats] = useState([]);

    const addSeat = () => {
        setSeats([...seats, { seatNumber: '', price: 0, isAvailable: true }]); // Varsayılan koltuk fiyatı 0
    };

    const updateSeat = (index, field, value) => {
        const updatedSeats = [...seats];
        updatedSeats[index][field] = field === 'price' ? parseFloat(value) : value;
        setSeats(updatedSeats);
    };

    const removeSeat = (index) => {
        const updatedSeats = seats.filter((_, i) => i !== index);
        setSeats(updatedSeats);
    };

    const onFinish = async (values) => {
        try {
            const newFlight = {
                departure: values.departure,
                arrival: values.arrival,
                date: values.date.format('YYYY-MM-DD'),
                airline: values.airline,
                price: parseFloat(values.price),
                duration: parseInt(values.duration, 10),
                isActive: true,
                seats: seats,
            };

            await addFlight(newFlight);
            message.success('Flight added successfully!');
        } catch (error) {
            message.error('An error occurred while adding the flight.');
        }
    };

    return (
        <div>
            <h1>Add New Flight</h1>
            <Form
                name="addFlight"
                layout="vertical"
                onFinish={onFinish}
            >
                <Form.Item
                    label="Departure"
                    name="departure"
                    rules={[{ required: true, message: 'Please input the departure location!' }]}
                >
                    <Input placeholder="Enter departure location" />
                </Form.Item>

                <Form.Item
                    label="Arrival"
                    name="arrival"
                    rules={[{ required: true, message: 'Please input the arrival location!' }]}
                >
                    <Input placeholder="Enter arrival location" />
                </Form.Item>

                <Form.Item
                    label="Date"
                    name="date"
                    rules={[{ required: true, message: 'Please select a date!' }]}
                >
                    <DatePicker style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    label="Airline"
                    name="airline"
                    rules={[{ required: true, message: 'Please select an airline!' }]}
                >
                    <Select placeholder="Select an airline">
                        <Option value="Turkish Airlines">Turkish Airlines</Option>
                        <Option value="Pegasus Airlines">Pegasus Airlines</Option>
                        <Option value="AnadoluJet">AnadoluJet</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Price"
                    name="price"
                    rules={[
                        { required: true, message: 'Please input the price!' },
                        { validator: (_, value) => (value > 0 ? Promise.resolve() : Promise.reject('Price must be greater than 0!')) },
                    ]}
                >
                    <Input type="number" placeholder="Enter price" />
                </Form.Item>

                <Form.Item
                    label="Duration (minutes)"
                    name="duration"
                    rules={[
                        { required: true, message: 'Please input the duration!' },
                        { validator: (_, value) => (value > 0 ? Promise.resolve() : Promise.reject('Duration must be greater than 0!')) },
                    ]}
                >
                    <Input type="number" placeholder="Enter duration" />
                </Form.Item>

                <h3>Seats</h3>
                {seats.map((seat, index) => (
                    <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                        <Input
                            placeholder="Seat Number"
                            value={seat.seatNumber}
                            onChange={(e) => updateSeat(index, 'seatNumber', e.target.value)}
                            style={{ width: '150px' }}
                        />
                        <Input
                            placeholder="Price"
                            type="number"
                            value={seat.price}
                            onChange={(e) => updateSeat(index, 'price', e.target.value)}
                            style={{ width: '150px' }}
                            min={0} // Koltuk fiyatı 0'dan küçük olamaz
                        />
                        <Button danger onClick={() => removeSeat(index)}>
                            Remove
                        </Button>
                    </div>
                ))}
                <Button type="dashed" onClick={addSeat} style={{ marginBottom: '20px' }}>
                    Add Seat
                </Button>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Add Flight
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default AddFlight;