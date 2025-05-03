import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Button, Form, Input, Select, DatePicker, Radio, Slider, Modal, List } from 'antd';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import './Home.css';


const { Option } = Select;

function Home({ isLoggedIn }) {
    const navigate = useNavigate();

    const [searchResults, setSearchResults] = useState([]);
    const [filteredResults, setFilteredResults] = useState([]);
    const [selectedFlight, setSelectedFlight] = useState(null);
    const [selectedSeat, setSelectedSeat] = useState(null);
    const [seatModalVisible, setSeatModalVisible] = useState(false);
    const [cart, setCart] = useState([]);

    const mockFlights = [
        {
            id: 1,
            departure: 'Istanbul',
            arrival: 'Ankara',
            date: '2023-05-10',
            airline: 'Turkish Airlines',
            price: 500,
            duration: 90,
            isDirect: true,
            seats: [
                { seatNumber: '1A', isAvailable: true, price: 50 },
                { seatNumber: '1B', isAvailable: false, price: 50 },
                { seatNumber: '1C', isAvailable: true, price: 50 },
            ],
        },
        {
            id: 2,
            departure: 'Istanbul',
            arrival: 'Izmir',
            date: '2023-05-11',
            airline: 'Pegasus Airlines',
            price: 400,
            duration: 120,
            isDirect: false,
            seats: [
                { seatNumber: '2A', isAvailable: true, price: 40 },
                { seatNumber: '2B', isAvailable: true, price: 40 },
                { seatNumber: '2C', isAvailable: false, price: 40 },
            ],
        },
    ];

    const onSearch = (values) => {
        console.log('Search Criteria:', values);

        // Temel arama kriterlerine göre mockFlights dizisini filtreleme
        const results = mockFlights.filter((flight) => {
            const matchesDeparture = flight.departure.toLowerCase() === values.departure.toLowerCase();
            const matchesArrival = flight.arrival.toLowerCase() === values.arrival.toLowerCase();
            const matchesDate = flight.date === values.date.format('YYYY-MM-DD');
            const matchesAirline = flight.airline === values.airline;

            return matchesDeparture && matchesArrival && matchesDate && matchesAirline;
        });

        // Sonuçları kaydet
        setSearchResults(results);
        setFilteredResults(results); // İlk filtreleme sonuçlarını kaydediyoruz
    };

    const onFilter = (values) => {
        console.log('Filter Criteria:', values);

        const results = mockFlights.filter((flight) => {
            const matchesDirect = values.isDirect === undefined || flight.isDirect === values.isDirect;
            const matchesPrice = values.price === undefined || flight.price <= values.price;
            const matchesDuration = values.duration === undefined || flight.duration <= values.duration;

            return matchesDirect && matchesPrice && matchesDuration;
        });

        if (results.length === 0) {
            console.warn('No flights match the filter criteria.');
        }

        setFilteredResults(results);
    };


    const onSelectFlight = (flight) => {
        setSelectedFlight(flight);
        setSeatModalVisible(true);
    };

    const onProceedToPayment = () => {
        if (!isLoggedIn) {
            message.warning('You need to log in to proceed to payment.');
            navigate('/login'); // Kullanıcıyı giriş sayfasına yönlendir
            return;
        }

        if (cart.length === 0) {
            message.warning('Your cart is empty. Please select a seat.');
            return;
        }

        // Kullanıcı giriş yapmışsa ödeme sayfasına yönlendir
        navigate('/pay');
    };

    const onSelectSeat = (seat) => {
        const isSeatAlreadyInCart = cart.some((item) => item.seatNumber === seat.seatNumber);
        if (isSeatAlreadyInCart) {
            message.warning(`Seat ${seat.seatNumber} is already selected.`);
            return;
        }

        if (selectedSeat) {
            setCart(cart.filter((item) => item.seatNumber !== selectedSeat.seatNumber));
        }

        setSelectedSeat(seat);
        setCart([...cart, { seatNumber: seat.seatNumber, price: seat.price }]);
        setSeatModalVisible(false);
    };

    const onRemoveSeat = (seatNumber) => {
        // Seçilen koltuğu sepetten kaldır
        setCart(cart.filter((item) => item.seatNumber !== seatNumber));
        message.info(`Seat ${seatNumber} has been removed from the cart.`);
    };



    return (
        <div>

            <div className="home-container">
                <h1 className="home-forms">Search Flights</h1>

                <div className='flex-items-center-gap'>
                    {/* Arama Formu */}
                    <Form
                        name="search"
                        layout="vertical"
                        onFinish={onSearch}
                        className="search-form"
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

                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Search
                            </Button>
                        </Form.Item>
                    </Form>

                    {/* Filtreleme Formu */}
                    <Form
                        name="filter"
                        layout="vertical"
                        onFinish={onFilter}
                        className="filter-form"
                    >
                        <Form.Item label="Direct Flight" name="isDirect">
                            <Radio.Group>
                                <Radio value={true}>Direct</Radio>
                                <Radio value={false}>With Stopovers</Radio>
                                <Radio value={undefined}>Any</Radio>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item label="Maximum Price" name="price" initialValue={1000}>
                            <Slider min={100} max={1000} step={50} />
                        </Form.Item>

                        <Form.Item label="Maximum Duration (minutes)" name="duration" initialValue={180}>
                            <Slider min={30} max={300} step={10} />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Apply Filters
                            </Button>
                        </Form.Item>
                    </Form>

                    {/* Arama Sonuçları */}

                </div>

                <div >
                    {filteredResults.length > 0 ? (
                        <div>
                            <h2>Search Results</h2>
                            <ul>
                                {filteredResults.map((flight) => (
                                    <li key={flight.id} className="mb-2">
                                        {flight.departure} → {flight.arrival} on {flight.date} ({flight.airline}) - ${flight.price} - {flight.duration} mins - {flight.isDirect ? 'Direct' : 'With Stopovers'}
                                        <Button
                                            type="link"
                                            onClick={() => onSelectFlight(flight)}
                                        >
                                            Select Flight
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <p>No flights found.</p>
                    )}
                </div>

                <div className="cart-container">
                    <h2>Cart</h2>
                    <ul>
                        {cart.map((item, index) => (
                            <li key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span>
                                    Seat: {item.seatNumber}, Price: ${item.price}
                                </span>
                                <Button
                                    type="text"
                                    danger
                                    onClick={() => onRemoveSeat(item.seatNumber)}
                                >
                                    Cancel
                                </Button>
                            </li>
                        ))}
                    </ul>
                    <p>
                        Total: ${cart.reduce((total, item) => total + item.price, 0)}
                    </p>
                    <Button type="primary" onClick={onProceedToPayment}>
                        Proceed to Payment
                    </Button>
                </div>
                {/* Koltuk Seçim Modali */}
                <Modal
                    title="Select a Seat"
                    open={seatModalVisible}
                    onCancel={() => setSeatModalVisible(false)}
                    footer={null}
                >
                    {selectedFlight && (
                        <List
                            dataSource={selectedFlight.seats.filter((seat) => seat.isAvailable)}
                            renderItem={(seat) => (
                                <List.Item>
                                    <Button
                                        type="primary"
                                        onClick={() => onSelectSeat(seat)}
                                    >
                                        {seat.seatNumber} - ${seat.price}
                                    </Button>
                                </List.Item>
                            )}
                        />
                    )}
                </Modal>


            </div>
        </div>
    );
}

export default Home;