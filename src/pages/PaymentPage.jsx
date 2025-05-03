import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import './PaymentPage.css';

function PaymentPage() {
    const mockCards = [
        {
            cardNumber: '1234 5678 9012 3456',
            expiryDate: '12/25',
            cvv: '123',
            cardHolder: 'John Doe',
        },
        {
            cardNumber: '9876 5432 1098 7654',
            expiryDate: '11/24',
            cvv: '456',
            cardHolder: 'Jane Smith',
        },
    ];

    const [loading, setLoading] = useState(false);

    const onFinish = (values) => {
        setLoading(true);

        const isValidCard = mockCards.some(
            (card) =>
                card.cardNumber === values.cardNumber &&
                card.expiryDate === values.expiryDate &&
                card.cvv === values.cvv &&
                card.cardHolder.toLowerCase() === values.cardHolder.toLowerCase()
        );

        setTimeout(() => {
            setLoading(false);
            if (isValidCard) {
                message.success('Payment successful! Thank you for your purchase.');
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
                    name="cardHolder"
                    rules={[{ required: true, message: 'Please enter the card holder name!' }]}
                >
                    <Input placeholder="John Doe" />
                </Form.Item>

                <Form.Item
                    label="Card Number"
                    name="cardNumber"
                    rules={[{ required: true, message: 'Please enter the card number!' }]}
                >
                    <Input placeholder="1234 5678 9012 3456" />
                </Form.Item>

                <Form.Item
                    label="Expiry Date"
                    name="expiryDate"
                    rules={[{ required: true, message: 'Please enter the expiry date!' }]}
                >
                    <Input placeholder="MM/YY" />
                </Form.Item>

                <Form.Item
                    label="CVV"
                    name="cvv"
                    rules={[{ required: true, message: 'Please enter the CVV!' }]}
                >
                    <Input.Password placeholder="123" />
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