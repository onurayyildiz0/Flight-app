import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PaymentPage from './pages/PaymentPage';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [mockUsers, setMockUsers] = useState([
    { username: 'user1', password: 'password1', email: 'user1@example.com' },
    { username: 'user2', password: 'password2', email: 'user2@example.com' },
  ]);

  return (
    <div className="App">
      <Router>
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <Routes>
          <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
          <Route
            path="/login"
            element={<Login setIsLoggedIn={setIsLoggedIn} mockUsers={mockUsers} />}
          />
          <Route
            path="/register"
            element={<Register setMockUsers={setMockUsers} mockUsers={mockUsers} />}
          />
          <Route path="/pay" element={<PaymentPage />} />
        </Routes>
      </Router>

    </div>

  );
}

export default App;
