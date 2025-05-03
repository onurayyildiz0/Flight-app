import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isLoggedIn, children }) => {
    if (!isLoggedIn) {
        // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
        return <Navigate to="/login" replace />;
    }

    // Kullanıcı giriş yapmışsa içeriği render et
    return children;
};

export default ProtectedRoute;