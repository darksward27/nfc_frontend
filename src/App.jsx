import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Hero from './components/Hero/Hero';
import SignUp from './components/SignUp/SignUp';
import './index.css';

function App() {
    const [auth, setAuth] = useState(() => {
        const saved = localStorage.getItem('auth');
        return saved ? JSON.parse(saved) : null;
    });

    const handleLogin = (authData) => {
        localStorage.setItem('auth', JSON.stringify(authData));
        setAuth(authData);
    };

    const handleLogout = () => {
        localStorage.removeItem('auth');
        setAuth(null);
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={auth ? <Navigate to="/dashboard" /> : <Hero />} />
                <Route 
                    path="/login" 
                    element={auth ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} 
                />
                <Route 
                    path="/signup" 
                    element={auth ? <Navigate to="/dashboard" /> : <SignUp />} 
                />
                <Route 
                    path="/dashboard" 
                    element={auth ? (
                        <Dashboard 
                            organizationId={auth.organizationId} 
                            onLogout={handleLogout}
                        />
                    ) : (
                        <Navigate to="/login" />
                    )} 
                />
            </Routes>
        </Router>
    );
}

export default App;