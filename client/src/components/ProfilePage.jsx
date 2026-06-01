import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { 
    User, Mail, Phone, Building2, Calendar, Shield, Edit3, Camera, 
    CheckCircle, ExternalLink, Hash, Clock, History, Layout, BookOpen, 
    Ticket as TicketIcon, Bell, Lock, LogOut
} from 'lucide-react';

const ProfilePage = () => {
    const { user, setAuthData } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('Overview');
    const [stats, setStats] = useState({});
    const [editForm, setEditForm] = useState({
        name: '',
        phoneNumber: '',
        department: '',
        faculty: '',
        bio: '',
        profileImage: ''
    });

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const res = await api.get('/users/me');
                setProfile(res.data);
                setEditForm({
                    name: res.data.name || '',
                    phoneNumber: res.data.phoneNumber || '',
                    department: res.data.department || '',
                    faculty: res.data.faculty || '',
                    bio: res.data.bio || '',
                    profileImage: res.data.profileImage || ''
                });

                // Fetch role-specific stats
                if (res.data.role === 'USER' || res.data.role === 'STUDENT') {
                    const bookingsRes = await api.get('/bookings/my');
                    const bookings = bookingsRes.data;
                    setStats({
                        total: bookings.length,
                        upcoming: bookings.filter(b => b.status === 'CONFIRMED').length,
                        cancelled: bookings.filter(b => b.status === 'CANCELLED').length,
                        history: bookings.slice(0, 5)
                    });
                } else if (res.data.role === 'ADMIN' || res.data.role === 'STAFF') {
                    const allBookingsRes = await api.get('/bookings');
                    const resourcesRes = await api.get('/resources');
                    setStats({
                        resources: resourcesRes.data.length,
                        pending: allBookingsRes.data.filter(b => b.status === 'PENDING').length,
                        today: allBookingsRes.data.filter(b => new Date(b.startTime).toDateString() === new Date().toDateString()).length,
                        actions: [] // Mock or fetch audit logs
                    });
                } else if (res.data.role === 'TECHNICIAN') {
                    const ticketsRes = await api.get('/tickets');
                    const tickets = ticketsRes.data;
                    setStats({
                        assigned: tickets.length,
                        pending: tickets.filter(t => t.status === 'OPEN').length,
                        completed: tickets.filter(t => t.status === 'CLOSED').length,
                        updates: tickets.slice(0, 5)
                    });
                }

                setLoading(false);
            } catch (err) {
                console.error("Error fetching profile", err);
                setError("Failed to load profile data. Please try again.");
                setLoading(false);
            }
        };

        if (user) {
            fetchProfileData();
        }
    }, [user]);

    const [formErrors, setFormErrors] = useState({});

    const validateForm = () => {
        let errors = {};
        if (!editForm.name.trim()) errors.name = "Full name is required";
        
        // Phone number validation (10 digits)
        if (editForm.phoneNumber && !/^\d{10}$/.test(editForm.phoneNumber.replace(/\D/g, ''))) {
            errors.phoneNumber = "Phone number must be exactly 10 digits";
        }

        // Image URL validation
        if (editForm.profileImage && !editForm.profileImage.startsWith('http')) {
            errors.profileImage = "Please enter a valid image URL (starting with http/https)";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Submit profile updates to the backend
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const res = await api.put('/users/me/profile', editForm);
            setProfile(res.data);
            if (setAuthData) {
                setAuthData(res.data, localStorage.getItem('token'));
            }
            setIsEditModalOpen(false);
            alert("Profile updated successfully!");
        } catch (err) {
            console.error("Error updating profile", err);
            alert(err.response?.data?.error || "Failed to update profile.");
        }
    };

    const handleDeactivateAccount = async () => {
        if (window.confirm("Are you sure you want to deactivate your account? This action cannot be undone and you will be logged out immediately.")) {
            try {
                await api.delete('/users/me');
                alert("Account deactivated successfully.");
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            } catch (err) {
                console.error("Error deactivating account", err);
                alert("Failed to deactivate account.");
            }
        }
    };

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
            <div className="animate-spin" style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid var(--primary)', borderRadius: '50%' }}></div>
        </div>
    );

    if (error) return <div className="p-card text-center py-12 text-red-500">{error}</div>;

    const tabs = ['Overview', 'My Bookings', 'My Tickets', 'Notifications', 'Security'];

    return (
        <div style={{ padding: '1rem 0' }}>
            {/* Profile Header Card */}
            <div className="p-card mb-8" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ height: '120px', background: 'linear-gradient(135deg, var(--primary) 0%, #1e3a5f 100%)' }}></div>
                <div style={{ padding: '0 2rem 2rem', marginTop: '-40px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
                        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-end' }}>
                            <div style={{ 
                                width: '120px', height: '120px', borderRadius: '24px', 
                                border: '4px solid white', backgroundColor: '#f8fafc',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                overflow: 'hidden', boxShadow: 'var(--shadow-md)'
                            }}>
                                {profile.profileImage ? (
                                    <img src={profile.profileImage} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <User size={60} color="#94a3b8" />
                                )}
                            </div>
                            <div style={{ paddingBottom: '0.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <h1 style={{ fontSize: '1.875rem', margin: 0, fontWeight: '800' }}>{profile.name}</h1>
                                    <span className="p-badge" style={{ 
                                        backgroundColor: profile.role === 'ADMIN' ? 'var(--secondary)' : (profile.role === 'STUDENT' ? '#3b82f6' : 'var(--primary)'),
                                        color: 'white'
                                    }}>
                                        {profile.role}
                                    </span>
                                </div>
                                <p style={{ margin: '0.25rem 0 0', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Mail size={16} /> {profile.email}
                                </p>
                            </div>
                        </div>
                        <div style={{ paddingBottom: '0.5rem' }}>
                            <button className="p-btn p-btn-primary" onClick={() => setIsEditModalOpen(true)}>
                                <Edit3 size={18} style={{ marginRight: '0.5rem' }} /> Edit Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem' }}>
                {/* Left Sidebar */}
                <div>
                    <div className="p-card mb-6">
                        <h3 style={{ fontSize: '1.125rem', marginBottom: '1.5rem' }}>Account Details</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <DetailItem icon={<Shield size={18} />} label="Status" value={profile.status} color="var(--success)" />
                            <DetailItem icon={<Calendar size={18} />} label="Joined" value={new Date(profile.joinedDate).toLocaleDateString()} />
                            <DetailItem icon={<Phone size={18} />} label="Phone" value={profile.phoneNumber || 'Not set'} />
                            <DetailItem icon={<Building2 size={18} />} label="Faculty" value={profile.faculty || 'Not set'} />
                            <DetailItem icon={<BookOpen size={18} />} label="Department" value={profile.department || 'Not set'} />
                            {profile.oauthProviderId && (
                                <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#eff6ff', borderRadius: '12px', border: '1px solid #dbeafe' }}>
                                    <span style={{ fontSize: '0.75rem', color: '#1d4ed8', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <CheckCircle size={14} /> Google Account Connected
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-card">
                        <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Short Bio</h3>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                            {profile.bio || "No biography added yet. Share a bit about yourself!"}
                        </p>
                    </div>
                </div>

                {/* Right Content */}
                <div>
                    {/* Navigation Tabs */}
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                        {tabs.map(tab => (
                            <button 
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                style={{
                                    padding: '0.5rem 1rem',
                                    border: 'none',
                                    background: 'none',
                                    color: activeTab === tab ? 'var(--primary)' : 'var(--text-secondary)',
                                    fontWeight: activeTab === tab ? '700' : '500',
                                    borderBottom: activeTab === tab ? '2px solid var(--primary)' : 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="animate-in">
                        {activeTab === 'Overview' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                {/* Stats Grid */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                                    {['USER', 'STUDENT'].includes(profile.role) ? (
                                        <>
                                            <StatCard icon={<Calendar />} label="Total Bookings" value={stats.total} color="#3b82f6" />
                                            <StatCard icon={<CheckCircle />} label="Confirmed" value={stats.upcoming} color="#10b981" />
                                            <StatCard icon={<Clock />} label="Cancelled" value={stats.cancelled} color="#ef4444" />
                                        </>
                                    ) : profile.role === 'ADMIN' || profile.role === 'STAFF' ? (
                                        <>
                                            <StatCard icon={<Layout />} label="Managed Resources" value={stats.resources} color="#3b82f6" />
                                            <StatCard icon={<Clock />} label="Pending Requests" value={stats.pending} color="#f59e0b" />
                                            <StatCard icon={<CheckCircle />} label="Today Verified" value={stats.today} color="#10b981" />
                                        </>
                                    ) : (
                                        <>
                                            <StatCard icon={<TicketIcon />} label="Assigned Tickets" value={stats.assigned} color="#3b82f6" />
                                            <StatCard icon={<Clock />} label="Pending" value={stats.pending} color="#f59e0b" />
                                            <StatCard icon={<CheckCircle />} label="Completed" value={stats.completed} color="#10b981" />
                                        </>
                                    )}
                                </div>

                                {/* Recent Activity */}
                                <div className="p-card">
                                    <h3 style={{ fontSize: '1.125rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <History size={20} /> Recent Activity
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {['USER', 'STUDENT'].includes(profile.role) ? (
                                            stats.history?.length > 0 ? stats.history.map((b, i) => (
                                                <ActivityItem key={i} title={`Booking for ${b.resourceName}`} subtitle={`${new Date(b.startTime).toLocaleDateString()} at ${new Date(b.startTime).toLocaleTimeString()}`} status={b.status} />
                                            )) : <EmptyState message="No recent bookings found." />
                                        ) : profile.role === 'TECHNICIAN' ? (
                                            stats.updates?.length > 0 ? stats.updates.map((t, i) => (
                                                <ActivityItem key={i} title={`Ticket: ${t.issue}`} subtitle={`Reported by ${t.reportedBy}`} status={t.status} />
                                            )) : <EmptyState message="No ticket updates yet." />
                                        ) : (
                                            <EmptyState message="No recent administrative actions recorded." />
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'Security' && (
                            <div className="p-card">
                                <h3 style={{ fontSize: '1.125rem', marginBottom: '2rem' }}>Account Security & Status</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <SecurityItem label="Sign-in Method" value={profile.oauthProviderId ? "Google OAuth2" : "Email & Password"} />
                                    <SecurityItem label="Google Connected" value={profile.oauthProviderId ? "Yes" : "No"} />
                                    <SecurityItem label="Account Role" value={profile.role} />
                                    <SecurityItem label="Account Status" value={profile.status} />
                                    <SecurityItem label="Last Updated" value={new Date().toLocaleDateString()} />
                                    
                                    <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '1rem' }}>
                                        {!profile.oauthProviderId && (
                                            <button className="p-btn p-btn-secondary">
                                                <Lock size={16} style={{ marginRight: '0.5rem' }} /> Change Password
                                            </button>
                                        )}
                                        <button 
                                            className="p-btn" 
                                            onClick={handleDeactivateAccount}
                                            style={{ backgroundColor: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca' }}
                                        >
                                            <LogOut size={16} style={{ marginRight: '0.5rem' }} /> Deactivate Account
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {['My Bookings', 'My Tickets', 'Notifications'].includes(activeTab) && (
                            <div className="p-card text-center py-20">
                                <p style={{ color: 'var(--text-secondary)' }}>Full {activeTab} history view is coming soon.</p>
                                <button className="p-btn p-btn-primary mt-4" onClick={() => setActiveTab('Overview')}>Return to Overview</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            {isEditModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                    backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
                }}>
                    <div className="p-card animate-in" style={{ width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h2 style={{ margin: 0 }}>Edit Profile</h2>
                            <button onClick={() => setIsEditModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem' }}>×</button>
                        </div>

                        <form onSubmit={handleUpdateProfile}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Full Name *</label>
                                    <input 
                                        type="text" className="p-input" 
                                        style={{ borderColor: formErrors.name ? 'var(--danger)' : '' }}
                                        value={editForm.name} 
                                        onChange={e => setEditForm({...editForm, name: e.target.value})}
                                        required
                                    />
                                    {formErrors.name && <span style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: '4px', display: 'block' }}>{formErrors.name}</span>}
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Phone Number</label>
                                    <input 
                                        type="tel" className="p-input" 
                                        style={{ borderColor: formErrors.phoneNumber ? 'var(--danger)' : '' }}
                                        value={editForm.phoneNumber} 
                                        onChange={e => setEditForm({...editForm, phoneNumber: e.target.value})}
                                        placeholder="0712345678"
                                    />
                                    {formErrors.phoneNumber && <span style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: '4px', display: 'block' }}>{formErrors.phoneNumber}</span>}
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Profile Image URL</label>
                                    <input 
                                        type="text" className="p-input" 
                                        style={{ borderColor: formErrors.profileImage ? 'var(--danger)' : '' }}
                                        value={editForm.profileImage} 
                                        onChange={e => setEditForm({...editForm, profileImage: e.target.value})}
                                        placeholder="https://example.com/image.jpg"
                                    />
                                    {formErrors.profileImage && <span style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: '4px', display: 'block' }}>{formErrors.profileImage}</span>}
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Faculty</label>
                                    <input 
                                        type="text" className="p-input" 
                                        value={editForm.faculty} 
                                        onChange={e => setEditForm({...editForm, faculty: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Department</label>
                                    <input 
                                        type="text" className="p-input" 
                                        value={editForm.department} 
                                        onChange={e => setEditForm({...editForm, department: e.target.value})}
                                    />
                                </div>
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Biography</label>
                                    <textarea 
                                        className="p-input" style={{ height: '100px', resize: 'none' }}
                                        value={editForm.bio} 
                                        onChange={e => setEditForm({...editForm, bio: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', opacity: 0.6 }}>Email (Read Only)</label>
                                    <input type="text" className="p-input" value={profile.email} disabled style={{ backgroundColor: '#f1f5f9' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', opacity: 0.6 }}>Role (Read Only)</label>
                                    <input type="text" className="p-input" value={profile.role} disabled style={{ backgroundColor: '#f1f5f9' }} />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem', justifyContent: 'flex-end' }}>
                                <button type="button" className="p-btn p-btn-secondary" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                                <button type="submit" className="p-btn p-btn-primary">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const DetailItem = ({ icon, label, value, color }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ color: 'var(--primary)', opacity: 0.8 }}>{icon}</div>
        <div>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase' }}>{label}</p>
            <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: '500', color: color || 'var(--text-primary)' }}>{value}</p>
        </div>
    </div>
);

const StatCard = ({ icon, label, value, color }) => (
    <div className="p-card" style={{ padding: '1.5rem', borderLeft: `4px solid ${color}` }}>
        <div style={{ color: color, marginBottom: '0.5rem' }}>
            {React.cloneElement(icon, { size: 24 })}
        </div>
        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{label}</p>
        <h4 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '800' }}>{value}</h4>
    </div>
);

const ActivityItem = ({ title, subtitle, status }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
        <div>
            <p style={{ margin: 0, fontWeight: '600', fontSize: '0.95rem' }}>{title}</p>
            <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{subtitle}</p>
        </div>
        <span className="p-badge" style={{ 
            fontSize: '0.7rem',
            backgroundColor: status === 'CONFIRMED' || status === 'CLOSED' ? '#dcfce7' : '#fee2e2',
            color: status === 'CONFIRMED' || status === 'CLOSED' ? '#166534' : '#991b1b'
        }}>
            {status}
        </span>
    </div>
);

const SecurityItem = ({ label, value }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
        <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>{label}</span>
        <span style={{ fontWeight: '700' }}>{value}</span>
    </div>
);

const EmptyState = ({ message }) => (
    <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
        <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>{message}</p>
    </div>
);

export default ProfilePage;
