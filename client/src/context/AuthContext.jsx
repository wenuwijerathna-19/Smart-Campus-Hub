import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // 💡 Restored bypass login so UI is visible by default!
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = async (email, password) => {
        try {
            const res = await api.post('/auth/login', { email, password });
            const { accessToken, user: userData } = res.data;
            localStorage.setItem('token', accessToken);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            return true;
        } catch (error) {
            console.error('Login failed', error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const googleLogin = async (credential) => {
        // Mocking Google login with assignment bypass credentials
        const mockUser = {
            id: "g-" + Math.random().toString(36).substr(2, 9),
            name: "Google Student",
            email: "student@smartcampus.edu",
            role: "USER"
        };
        localStorage.setItem('token', credential || "mock-google-token");
        localStorage.setItem('user', JSON.stringify(mockUser));
        setUser(mockUser);
        return true;
    };

    const setAuthData = (userData, token) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', token);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, googleLogin, setAuthData, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
