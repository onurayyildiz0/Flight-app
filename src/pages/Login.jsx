import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import './Login.css';

function Login({ setIsLoggedIn, mockUsers }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const onFinish = (values) => {
        setLoading(true);

        const isValidUser = mockUsers.some(
            (user) =>
                user.username === values.username &&
                user.password === values.password
        );

        setTimeout(() => {
            setLoading(false);
            if (isValidUser) {
                message.success('Login successful!');
                setIsLoggedIn(true); // Kullanıcı oturumunu güncelle
                navigate('/'); // Ana sayfaya yönlendir
            } else {
                message.error('Invalid username or password.');
            }
        }, 1000);
    };

    return (
        <div className="full-height">
            <div className="login-container">
                <h1>Login</h1>
                <Form
                    name="login"
                    layout="vertical"
                    onFinish={onFinish}
                    className="login-form"
                >
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[{ required: true, message: 'Please enter your username!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please enter your password!' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Login
                        </Button>
                    </Form.Item>
                </Form>

                <p className="login-link " style={{ color: 'blue' }}    >
                    <Link to="/register" >
                        Don't have an account?{' '}Create an Account
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;