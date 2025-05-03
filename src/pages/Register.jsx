import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Input, message } from 'antd';
import './Register.css';

function Register({ setMockUsers, mockUsers }) {
    const navigate = useNavigate();

    const onFinish = (values) => {
        // Yeni kullanıcıyı mockUsers dizisine ekle
        const newUser = {
            username: values.username,
            password: values.password,
            email: values.email,
        };

        // Kullanıcı zaten varsa hata mesajı göster
        const isUserExists = mockUsers.some((user) => user.email === values.email);
        if (isUserExists) {
            message.error('A user with this email already exists.');
            return;
        }

        setMockUsers([...mockUsers, newUser]); // Kullanıcıyı listeye ekle
        message.success('Registration successful! You can now log in.');
        navigate('/login'); // Giriş sayfasına yönlendir
    };

    return (
        <div className="register-container">
            <div className="register-content">
                <Form
                    name="register"
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                    className="register-form"
                >
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Please input your email!' },
                            { type: 'email', message: 'Please enter a valid email!' },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Register
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}

export default Register;