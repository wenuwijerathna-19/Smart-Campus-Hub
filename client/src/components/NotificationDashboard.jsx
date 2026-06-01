import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Bell, Check, CheckCircle2, Calendar, Wrench, Clock, Filter, List } from 'lucide-react';
import api from '../services/api';
// get user details
const NotificationDashboard = () => {
    const { user } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [statusFilter, setStatusFilter] = useState('All'); // All, Unread, Read
    const [typeFilter, setTypeFilter] = useState('All'); // All, Booking, Ticket, Reminder

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const res = await api.get('/notifications');
            setNotifications(res.data);
        } catch (err) {
            console.error('Error fetching notifications:', err);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, isRead: true } : n)
            );
        } catch (err) {
            console.error('Error marking as read:', err);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.put('/notifications/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (err) {
            console.error('Error marking all as read:', err);
        }
    };

    const getIconForType = (message) => {
        const msg = message.toLowerCase();
        if (msg.includes('booking')) return <Calendar size={20} color="var(--primary)" />;
        if (msg.includes('ticket') || msg.includes('job')) return <Wrench size={20} color="var(--warning)" />;
        if (msg.includes('reminder') || msg.includes('upcoming')) return <Clock size={20} color="var(--sd-open)" />;
        return <Bell size={20} color="var(--text-secondary)" />;
    };

    // Derived type for filtering purposes based on message content
    const getNotificationType = (message) => {
        const msg = message.toLowerCase();
        if (msg.includes('booking')) return 'Booking';
        if (msg.includes('ticket') || msg.includes('job')) return 'Ticket';
        if (msg.includes('reminder') || msg.includes('upcoming')) return 'Reminder';
        return 'Other';
    };

    const filteredNotifications = notifications.filter(n => {
        const statusMatch =
            statusFilter === 'All' ? true :
                statusFilter === 'Unread' ? !n.isRead :
                    statusFilter === 'Read' ? n.isRead : true;

        const typeMatch =
            typeFilter === 'All' ? true :
                getNotificationType(n.message) === typeFilter;

        return statusMatch && typeMatch;
    });

    const unreadCount = notifications.filter(n => !n.isRead).length;

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem' }}>
                <p>Loading notifications...</p>
            </div>
        );
    }

    return (
        <div className="fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Bell size={28} color="var(--primary)" />
                        Notifications Center
                    </h2>
                    <p style={{ marginTop: '0.25rem' }}>Manage and view all your campus alerts in one place.</p>
                </div>

                {unreadCount > 0 && (
                    <button
                        onClick={markAllAsRead}
                        className="p-btn p-btn-secondary"
                        style={{ height: '40px' }}
                    >
                        <CheckCircle2 size={18} /> Mark All as Read
                    </button>
                )}
            </div>

            {/* Filters */}
            <div className="p-card mb-6 flex items-center justify-between" style={{ padding: '1rem 1.5rem' }}>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <Filter size={18} color="var(--text-secondary)" />
                        <span className="font-bold text-sm">Status:</span>
                        <div className="flex gap-2 ml-2">
                            {['All', 'Unread', 'Read'].map(status => (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    style={{
                                        background: statusFilter === status ? 'var(--primary)' : 'transparent',
                                        color: statusFilter === status ? 'white' : 'var(--text-secondary)',
                                        border: `1px solid ${statusFilter === status ? 'var(--primary)' : 'var(--border-color)'}`,
                                        padding: '0.35rem 0.85rem',
                                        borderRadius: '50px',
                                        fontSize: '0.8rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {status}
                                    {status === 'Unread' && unreadCount > 0 && (
                                        <span style={{
                                            background: statusFilter === status ? 'white' : 'var(--primary)',
                                            color: statusFilter === status ? 'var(--primary)' : 'white',
                                            padding: '2px 6px',
                                            borderRadius: '10px',
                                            marginLeft: '6px',
                                            fontSize: '0.7rem'
                                        }}>
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ width: '1px', height: '24px', background: 'var(--border-color)' }}></div>

                    <div className="flex items-center gap-2">
                        <List size={18} color="var(--text-secondary)" />
                        <span className="font-bold text-sm">Type:</span>
                        <select
                            className="p-input"
                            style={{ padding: '0.35rem 0.85rem', width: 'auto', borderRadius: '50px', fontSize: '0.8rem', fontWeight: '600' }}
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                        >
                            <option value="All">All Types</option>
                            <option value="Booking">Bookings</option>
                            <option value="Ticket">Tickets & Jobs</option>
                            <option value="Reminder">Reminders</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Notifications List */}
            <div className="flex flex-col gap-4">
                {filteredNotifications.length === 0 ? (
                    <div className="p-card text-center" style={{ padding: '4rem 2rem' }}>
                        <Bell size={48} color="var(--border-color)" style={{ margin: '0 auto 1rem auto' }} />
                        <h3>No notifications found</h3>
                        <p>You're all caught up with your {typeFilter !== 'All' ? typeFilter.toLowerCase() : ''} alerts!</p>
                    </div>
                ) : (
                    filteredNotifications.map(n => (
                        <div
                            key={n.id}
                            className="p-card"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1.5rem',
                                padding: '1.5rem',
                                borderLeft: !n.isRead ? '4px solid var(--primary)' : '4px solid transparent',
                                opacity: n.isRead ? 0.7 : 1,
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <div style={{
                                background: 'var(--surface-color-light)',
                                padding: '1rem',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {getIconForType(n.message)}
                            </div>

                            <div style={{ flex: 1 }}>
                                <div className="flex justify-between items-start mb-1">
                                    <h4 style={{
                                        margin: 0,
                                        fontSize: '1.05rem',
                                        fontWeight: !n.isRead ? '700' : '500',
                                        color: !n.isRead ? 'var(--text-primary)' : 'var(--text-secondary)'
                                    }}>
                                        {n.message}
                                    </h4>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', marginLeft: '1rem' }}>
                                        {new Date(n.createdAt).toLocaleString()}
                                    </span>
                                </div>
                                <p style={{ margin: 0, fontSize: '0.85rem' }}>
                                    Type: <span style={{ fontWeight: '600' }}>{getNotificationType(n.message)}</span>
                                </p>
                            </div>

                            {!n.isRead && (
                                <button
                                    onClick={() => markAsRead(n.id)}
                                    className="p-btn"
                                    style={{
                                        background: 'rgba(22, 101, 52, 0.1)',
                                        color: 'var(--primary)',
                                        borderRadius: '50%',
                                        width: '40px',
                                        height: '40px',
                                        padding: 0
                                    }}
                                    title="Mark as read"
                                >
                                    <Check size={20} />
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default NotificationDashboard;
