import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css'; // İsteğe bağlı CSS dosyası

function NotFound() {
    return (
        <div className="not-found-container">
            <h1>404</h1>
            <p>Oops! The page you are looking for does not exist.</p>
            <Link to="/" className="back-home-link">
                Go Back to Home
            </Link>
        </div>
    );
}

export default NotFound;