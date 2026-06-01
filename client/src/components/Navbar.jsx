import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Building2, Calendar, ClipboardList, Bell, Check, LayoutDashboard, Search, Wrench, User } from 'lucide-react';
import api from '../services/api';

const Navbar = () => {
    const { user } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);

    const fetchNotifications = async () => {
        if (!user) return;
        try {
            const res = await api.get('/notifications/unread');
            setNotifications(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, [user]);

    const markAsRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(prev => prev.filter(n => n.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <header className="app-header">
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none', color: 'white' }}>
                <div style={{ backgroundColor: 'white', borderRadius: '4px', padding: '4px' }}>
                    <Building2 size={24} color="var(--primary)" />
                </div>
                <h1 style={{ fontSize: '1.25rem', margin: 0, fontWeight: '700' }}>Smart Campus Hub</h1>
            </Link>

            <nav className="flex items-center gap-8" style={{ marginLeft: '2rem' }}>
                {user && (
                    <>
                        <Link to="/" className="nav-link-custom">Home</Link>
                        <Link to="/dashboard" className="nav-link-custom">
                            Facilities <LayoutDashboard size={18} />
                        </Link>
                    </>
                )}
                
                {/* Student / User Specific */}
                {['USER', 'STUDENT'].includes(user?.role) && (
                    <Link to="/bookings/my" className="nav-link-custom">
                        My Bookings <Calendar size={18} />
                    </Link>
                )}

                {/* Staff / Admin Specific */}
                {(user?.role === 'ADMIN' || user?.role === 'STAFF') && (
                    <Link to="/bookings" className="nav-link-custom">
                        Booking Admin <ClipboardList size={18} />
                    </Link>
                )}

                {/* Technician Specific */}
                {(user?.role === 'ADMIN' || user?.role === 'TECHNICIAN') && (
                    <Link to="/tickets" className="nav-link-custom">
                        Ticketing <Wrench size={18} />
                    </Link>
                )}
                
                {/* General Service Desk for others to report */}
                {['USER', 'STUDENT'].includes(user?.role) && (
                    <Link to="/tickets" className="nav-link-custom">
                        Ticketing <ClipboardList size={18} />
                    </Link>
                )}

                {/* Notifications Dashboard */}
                {user && (
                    <Link to="/notifications" className="nav-link-custom">
                        Notifications <Bell size={18} />
                    </Link>
                )}
            </nav>

            <div className="flex items-center gap-4 relative" style={{ marginLeft: 'auto' }}>
                <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setShowNotifications(!showNotifications)}>
                    <Bell size={20} color="rgba(255,255,255,0.8)" />
                    {notifications.length > 0 && (
                        <span style={{
                            position: 'absolute', top: '-6px', right: '-6px', background: 'var(--secondary)',
                            borderRadius: '50%', minWidth: '18px', height: '18px', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: 'white', fontWeight: 'bold'
                        }}>
                            {notifications.length > 9 ? '9+' : notifications.length}
                        </span>
                    )}
                </div>

                {showNotifications && (
                    <div className="p-card" style={{
                        position: 'absolute', top: '100%', right: '0px', width: '320px',
                        padding: '1rem', zIndex: 100, marginTop: '1rem',
                        boxShadow: 'var(--shadow-lg)', color: 'var(--text-primary)'
                    }}>
                        <div className="flex justify-between items-center mb-2" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                            <h4 style={{ margin: 0 }}>Notifications</h4>
                            <span style={{ fontSize: '0.75rem', color: 'var(--primary)', cursor: 'pointer' }} onClick={() => setShowNotifications(false)}>Close</span>
                        </div>
                        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            {notifications.length === 0 ? (
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', textAlign: 'center', margin: '1.5rem 0' }}>All caught up!</p>
                            ) : notifications.map(n => (
                                <div key={n.id} style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontSize: '0.875rem', margin: '0 0 0.25rem 0' }}>{n.message}</p>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{new Date(n.createdAt).toLocaleString()}</span>
                                    </div>
                                    <button onClick={() => markAsRead(n.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', padding: '0.25rem' }} title="Mark as read">
                                        <Check size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div style={{ borderLeft: '1px solid rgba(255,255,255,0.2)', height: '24px', margin: '0 8px' }}></div>

                {user ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginLeft: '0.5rem' }}>
                        <Link to="/profile" style={{ 
                            color: 'white', fontSize: '0.9rem', fontWeight: '500', 
                            textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem',
                            padding: '4px 10px', borderRadius: '8px', transition: 'background 0.2s'
                        }} onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                            <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                {user.profileImage ? <img src={user.profileImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <User size={16} />}
                            </div>
                            {user.name}
                        </Link>
                        <button onClick={() => {
                            localStorage.removeItem('token');
                            localStorage.removeItem('user');
                            window.location.href = '/login';
                        }} style={{ 
                            backgroundColor: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.5)', 
                            padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem'
                        }}>
                            Logout
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginLeft: '0.5rem' }}>
                        <Link to="/login" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '500', transition: 'color 0.3s ease' }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.9)'}
                        >Sign In</Link>
                        <Link to="/signup" style={{ 
                            backgroundColor: 'var(--secondary)', 
                            color: 'white', 
                            padding: '9px 22px', 
                            borderRadius: '50px', 
                            textDecoration: 'none', 
                            fontSize: '0.95rem', 
                            fontWeight: '600',
                            border: '2px solid var(--secondary)',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 2px 10px rgba(34, 197, 94, 0.3)'
                        }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--secondary-hover)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--secondary)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                        >Sign Up</Link>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Navbar;
