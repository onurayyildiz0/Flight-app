import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import './Login.css';
import { fetchUsers } from '../services/userService';

function Login({ setIsLoggedIn }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        const { username, password } = values;
        setLoading(true);

        try {
            const users = await fetchUsers(); // Kullanıcıları API'den al
            const user = users.find(
                (u) => u.name === username && u.password === password // Kullanıcı adı ve şifreyi kontrol et
            );

            if (user) {
                message.success('Login successful!');
                setIsLoggedIn(true); // Kullanıcıyı giriş yapmış olarak işaretle
                localStorage.setItem('loggedInRowId', user.row_id); // Kullanıcının row_id'sini kaydet

                const cart = JSON.parse(localStorage.getItem('cart')) || []; // Sepeti localStorage'dan al
                if (cart.length > 0) {
                    navigate('/pay'); // Sepet doluysa ödeme sayfasına yönlendir
                } else {
                    navigate('/'); // Sepet boşsa ana sayfaya yönlendir
                }
            } else {
                message.error('Invalid username or password.');
            }
        } catch (error) {
            message.error('An error occurred while logging in.');
        } finally {
            setLoading(false);
        }
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