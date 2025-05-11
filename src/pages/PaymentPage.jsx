import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import { getCards } from '../services/cardService';
import { useNavigate } from 'react-router-dom';
import { fetchUsers } from '../services/userService';
import { updateFlight } from '../services/flightService';
import './PaymentPage.css';

function PaymentPage() {

    const location = useLocation();
    const cart = location.state?.cart || []; // Eğer cart yoksa boş bir dizi kullan
    const flights = location.state?.flights || []; // Eğer flig
    console.log('Cart:', cart);
    console.log('Flights:', flights);

    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const navigate = useNavigate();

    // Kullanıcıyı doğrulama ve e-posta adresini alma
    const fetchUser = async () => {
        try {
            const users = await fetchUsers(); // Kullanıcı listesini al
            console.log('Fetched Users:', users);

            const loggedInRowId = localStorage.getItem('loggedInRowId'); // Giriş yapan kullanıcının row_id'sini al
            console.log('Logged In Row ID:', loggedInRowId);

            if (loggedInRowId) {
                const user = users.find((u) => u.row_id.toString() === loggedInRowId); // Kullanıcıyı row_id ile bul
                console.log('Matched User:', user);

                if (user) {
                    setUserEmail(user.email); // Kullanıcının e-posta adresini ayarla
                    return;
                }
            }

            message.error('User not found. Please log in again.');
            navigate('/login'); // Kullanıcı bulunamazsa giriş sayfasına yönlendir
        } catch (error) {
            console.error('Error fetching user:', error);
            message.error('An error occurred while fetching user details.');
        }
    };

    // Kart bilgilerini alma
    const fetchCards = async () => {
        try {
            const data = await getCards();
            console.log('Fetched Cards:', data);
            setCards(data);
        } catch (error) {
            message.error('An error occurred while fetching card details.');
        }
    };

    // useEffect ile kullanıcı ve kart bilgilerini al
    useEffect(() => {
        fetchUser();
        fetchCards();
    }, []);

    // Ödeme işlemi
    const onFinish = async (values) => {
        console.log('Form Values:', values);
        console.log('Fetched Cards:', cards);

        setLoading(true);

        const isValidCard = cards.some((card) => {
            return (
                card.cardNumber.replace(/\s+/g, '') === values.cardNumber.replace(/\s+/g, '') &&
                card.expiryDate === values.expiryDate &&
                card.cvv === values.cvv &&
                card.cardHolderName?.toLowerCase().trim() === values.cardHolderName?.toLowerCase().trim()
            );
        });

        setTimeout(async () => {
            setLoading(false);
            if (isValidCard) {
                try {
                    // Sepetteki her uçuş için koltuk durumunu güncelle
                    for (const item of cart) {
                        const flight = flights.find((f) => f.id === item.flightId);

                        if (!flight) {
                            console.error(`Flight with ID ${item.flightId} not found in flights.`);
                            continue; // Eğer uçuş bulunamazsa bir sonraki döngüye geç
                        }

                        const updatedSeats = flight.seats.map((s) =>
                            s.seatNumber === item.seatNumber ? { ...s, isAvailable: false } : s
                        );

                        await updateFlight(item.flightId, updatedSeats, flight);
                    }
                    message.success(`Payment successful! A confirmation email has been sent to ${userEmail}.`);
                    navigate('/'); // Ödeme başarılı olduğunda ana sayfaya yönlendir
                } catch (error) {
                    console.error('Error updating seat availability:', error);
                    message.error('An error occurred while updating seat availability.');
                }
            } else {
                message.error('Invalid card details. Please try again.');
            }
        }, 1000);
    };
    return (
        <div className="payment-container">
            <h1>Payment Page</h1>
            <p>Thank you for your purchase! Please complete your payment below.</p>

            <Form
                name="payment"
                layout="vertical"
                onFinish={onFinish}
                className="payment-form"
            >
                <Form.Item
                    label="Card Holder Name"
                    name="cardHolderName"
                    rules={[
                        { required: true, message: 'Please enter the card holder name!' },
                        { pattern: /^[a-zA-Z\s]+$/, message: 'Card holder name must contain only letters and spaces!' },
                    ]}
                >
                    <Input placeholder="John Doe" />
                </Form.Item>

                <Form.Item
                    label="Card Number"
                    name="cardNumber"
                    rules={[
                        { required: true, message: 'Please enter the card number!' },
                        { pattern: /^\d{16}$/, message: 'Card number must be 16 digits!' },
                    ]}
                >
                    <Input placeholder="1234 5678 9012 3456" maxLength={16} />
                </Form.Item>

                <Form.Item
                    label="Expiry Date"
                    name="expiryDate"
                    rules={[
                        { required: true, message: 'Please enter the expiry date!' },
                        { pattern: /^(0[1-9]|1[0-2])\/\d{2}$/, message: 'Expiry date must be in MM/YY format!' },
                    ]}
                >
                    <Input placeholder="MM/YY" maxLength={5} />
                </Form.Item>

                <Form.Item
                    label="CVV"
                    name="cvv"
                    rules={[
                        { required: true, message: 'Please enter the CVV!' },
                        { pattern: /^\d{3}$/, message: 'CVV must be 3 digits!' },
                    ]}
                >
                    <Input.Password placeholder="123" maxLength={3} />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Pay Now
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default PaymentPage;