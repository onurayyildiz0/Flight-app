import React, { useState } from 'react';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Button, Dropdown } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css'; // CSS dosyasını içe aktar

function Navbar({ isLoggedIn, setIsLoggedIn }) {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false); // Hamburger menü için state

    const handleLogout = () => {
        setIsLoggedIn(false); // Kullanıcı oturumunu kapat
        navigate('/login'); // Giriş sayfasına yönlendir
    };

    const guestMenuItems = [
        {
            key: '1',
            label: (
                <Link to="/login" rel="noopener noreferrer">
                    Login
                </Link>
            ),
        },
        {
            key: '2',
            label: (
                <Link rel="noopener noreferrer" to="/register">
                    Register
                </Link>
            ),
        },
    ];

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen); // Hamburger menüyü aç/kapat
    };

    return (
        <div className="navbar">
            <Link to="/" className="navbar-title">
                <h4>Flight Automation</h4>
            </Link>

            <div className="navbar-toggle" onClick={toggleMenu}>
                ☰
            </div>

            <div className={`actions ${isMenuOpen ? 'active' : ''}`}>
                <Avatar className="avatar" size={32} icon={<UserOutlined />} />
                {isLoggedIn ? (
                    // Kullanıcı giriş yaptıysa sadece Logout butonu göster
                    <Button type="primary" danger onClick={handleLogout}>
                        Logout
                    </Button>
                ) : (
                    // Kullanıcı giriş yapmadıysa Üye Girişi menüsü göster
                    <Dropdown menu={{ items: guestMenuItems }} placement="bottomLeft">
                        <Button>Üye Girişi</Button>
                    </Dropdown>
                )}
            </div>
        </div>
    );
}

export default Navbar;