import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PaymentPage from './pages/PaymentPage';
import Navbar from './components/Navbar';
import AddFlight from './pages/AddFlight';
import ManageFlights from './pages/ManageFlights';
import ProtectedRoute from './pages/ProtectedRoute';
import './App.css';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  return (
    <div className="App">
      <Router>
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <Routes>
          <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
          <Route
            path="/login"
            element={<Login setIsLoggedIn={setIsLoggedIn} />}
          />
          <Route path="/register" element={<Register />} />{/* Kayıt sayfası */}
          <Route
            path="/pay"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <PaymentPage />
              </ProtectedRoute>
            }
          /> {/* Ödeme sayfası */}
          <Route path="/add-flight" element={<AddFlight />} />{/*Uçuş ekleme sayfası */}
          <Route path="/manage-flights" element={<ManageFlights />} />{/*Uçakları listeleme ve uçuşları silme sayfası */}

        </Routes>
      </Router>

    </div>

  );
}

export default App;
