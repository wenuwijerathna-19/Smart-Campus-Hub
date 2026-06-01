import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import MyBookings from './components/MyBookings';
import AdminBookings from './components/AdminBookings';
import Tickets from './components/Tickets';
import Login from './components/Login';
import Signup from './components/Signup';
import NotificationDashboard from './components/NotificationDashboard';
import OAuth2RedirectHandler from './components/OAuth2RedirectHandler';
import ProfilePage from './components/ProfilePage';
import './index.css';

import ChatBot from './components/ChatBot';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-container">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={
              <main className="app-main">
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/bookings/my" element={<MyBookings />} />
                  <Route path="/bookings" element={<AdminBookings />} />
                  <Route path="/tickets" element={<Tickets />} />
                  <Route path="/notifications" element={<NotificationDashboard />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </main>
            } />
          </Routes>
          <ChatBot />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
