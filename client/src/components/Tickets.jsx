import React, { useState, useEffect, useContext } from 'react';
import { Headset } from 'lucide-react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import TicketForm from './TicketForm';
import TicketDetails from './TicketDetails';

const Tickets = () => {
    const { user } = useContext(AuthContext);
    const [tickets, setTickets] = useState([]);
    const [filteredTickets, setFilteredTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedTicketId, setSelectedTicketId] = useState(null);
    const [activeTab, setActiveTab] = useState('ALL_TICKETS');
    
    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [priorityFilter, setPriorityFilter] = useState('ALL');
    const [categoryFilter, setCategoryFilter] = useState('ALL');

    useEffect(() => {
        // Clear old mock data from cache if present
        const cached = localStorage.getItem(`tickets_${user?.id}`);
        if (cached) {
            const parsed = JSON.parse(cached);
            // If any mock ID is found, clear the whole cache
            if (parsed.some(t => t.id && (t.id.includes('4147') || t.id.includes('4148') || t.id.includes('4e51')))) {
                localStorage.removeItem(`tickets_${user?.id}`);
            } else {
                setTickets(parsed);
                setFilteredTickets(parsed);
                setLoading(false);
            }
        }

        if (user) {
            fetchTickets();
        }
    }, [user]);

    const fetchTickets = async (force = false) => {
        try {
            if (force || !localStorage.getItem(`tickets_${user?.id}`)) {
                setLoading(true);
            }
            console.log("Fetching tickets from server...", force ? "(Forced)" : "");
            let url = '/tickets/my';
            if (user?.role?.toUpperCase() === 'ADMIN') url = '/tickets';
            else if (user?.role?.toUpperCase() === 'TECHNICIAN') url = '/tickets/technician/my-tickets';
            
            const res = await api.get(url);
            setTickets(res.data || []);
            setFilteredTickets(res.data || []);
            
            if (res.data && res.data.length > 0) {
                localStorage.setItem(`tickets_${user?.id}`, JSON.stringify(res.data));
            } else {
                localStorage.removeItem(`tickets_${user?.id}`);
            }
        } catch (err) {
            console.error("Failed to fetch tickets:", err);
            // Don't alert here as we might have cached data to show
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = () => {
        localStorage.removeItem(`tickets_${user?.id}`);
        fetchTickets(true);
    };

    useEffect(() => {
        let result = tickets;

        if (searchQuery) {
            result = result.filter(t => 
                t.id?.toLowerCase()?.includes(searchQuery.toLowerCase()) || 
                t.description?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
                t.category?.toLowerCase()?.includes(searchQuery.toLowerCase())
            );
        }

        if (statusFilter !== 'ALL') {
            result = result.filter(t => t.status === statusFilter);
        }

        if (priorityFilter !== 'ALL') {
            result = result.filter(t => t.priority === priorityFilter);
        }

        if (categoryFilter !== 'ALL') {
            result = result.filter(t => t.category === categoryFilter);
        }

        setFilteredTickets(result);
    }, [searchQuery, statusFilter, priorityFilter, categoryFilter, tickets]);

    const handleDeleteTicket = async (id) => {
        if (!window.confirm('Are you sure you want to permanently delete this incident report?')) return;
        try {
            await api.delete(`/tickets/${id}`);
            fetchTickets();
        } catch (err) {
            console.error("Failed to delete ticket", err);
            alert("Could not delete ticket. Please try again.");
        }
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'OPEN': return 'badge-status-open';
            case 'IN_PROGRESS': return 'badge-status-progress';
            case 'RESOLVED': return 'badge-status-resolved';
            case 'CLOSED': return 'badge-status-closed';
            case 'REJECTED': return 'badge-status-rejected';
            default: return '';
        }
    };

    const getPriorityBadgeClass = (priority) => {
        switch (priority) {
            case 'LOW': return 'badge-priority-low';
            case 'MEDIUM': return 'badge-priority-medium';
            case 'HIGH': return 'badge-priority-high';
            case 'URGENT': return 'badge-priority-urgent';
            default: return '';
        }
    };

    if (!user) return <div className="p-card text-center py-12">Please login to view tickets.</div>;

    const renderSummaryCards = () => {
        if (!user || user.role?.toUpperCase() === 'USER') return null;
        
        const total = tickets.length;
        const open = tickets.filter(t => t.status === 'OPEN').length;
        const unassigned = tickets.filter(t => !t.assignee).length;
        const highPriority = tickets.filter(t => t.priority === 'HIGH' || t.priority === 'URGENT').length;

        return (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="p-card stat-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.3s ease', border: 'none', background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', position: 'relative', zIndex: 2 }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#10b981', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                        </div>
                        <div className="text-sm font-bold" style={{ color: '#047857' }}>All</div>
                    </div>
                    <div style={{ position: 'relative', zIndex: 2 }}>
                        <div className="text-3xl font-black mb-1" style={{ color: '#064e3b' }}>{total}</div>
                        <div className="text-sm font-bold" style={{ color: '#065f46' }}>Total Tickets</div>
                    </div>
                    <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.3)', zIndex: 1 }}></div>
                </div>

                <div className="p-card stat-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.3s ease', border: 'none', background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', position: 'relative', zIndex: 2 }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#3b82f6', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 4px 10px rgba(59, 130, 246, 0.3)' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                        </div>
                        <div className="text-sm font-bold" style={{ color: '#1d4ed8' }}>Active</div>
                    </div>
                    <div style={{ position: 'relative', zIndex: 2 }}>
                        <div className="text-3xl font-black mb-1" style={{ color: '#1e3a8a' }}>{open}</div>
                        <div className="text-sm font-bold" style={{ color: '#1e40af' }}>Open Tickets</div>
                    </div>
                    <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.3)', zIndex: 1 }}></div>
                </div>

                <div className="p-card stat-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.3s ease', border: 'none', background: 'linear-gradient(135deg, #cffafe 0%, #a5f3fc 100%)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', position: 'relative', zIndex: 2 }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#0891b2', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 4px 10px rgba(8, 145, 178, 0.3)' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                        </div>
                        <div className="text-sm font-bold" style={{ color: '#0f766e' }}>Pending</div>
                    </div>
                    <div style={{ position: 'relative', zIndex: 2 }}>
                        <div className="text-3xl font-black mb-1" style={{ color: '#164e63' }}>{unassigned}</div>
                        <div className="text-sm font-bold" style={{ color: '#155e75' }}>Unassigned</div>
                    </div>
                    <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.3)', zIndex: 1 }}></div>
                </div>

                <div className="p-card stat-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.3s ease', border: 'none', background: 'linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', position: 'relative', zIndex: 2 }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#ea580c', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 4px 10px rgba(234, 88, 12, 0.3)' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                        </div>
                        <div className="text-sm font-bold" style={{ color: '#c2410c' }}>Urgent</div>
                    </div>
                    <div style={{ position: 'relative', zIndex: 2 }}>
                        <div className="text-3xl font-black mb-1" style={{ color: '#7c2d12' }}>{highPriority}</div>
                        <div className="text-sm font-bold" style={{ color: '#9a3412' }}>High Priority</div>
                    </div>
                    <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.3)', zIndex: 1 }}></div>
                </div>
                <style dangerouslySetInnerHTML={{__html: `
                    .stat-card:hover {
                        transform: translateY(-5px);
                        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                    }
                `}} />
            </div>
        );
    };

    const renderTabs = () => {
        if (!user) return null;
        
        const isAdmin = user.role?.toUpperCase() === 'ADMIN';
        const isTechnician = user.role?.toUpperCase() === 'TECHNICIAN';
        const isUser = user.role?.toUpperCase() === 'USER';

        if (isUser || isAdmin) {
            return null; // Users and Admins have no tabs
        }

        return (
            <div className="flex gap-4 mb-6" style={{ borderBottom: '1px solid var(--border-color)' }}>
                <button 
                    className={`pb-2 px-1 font-bold ${activeTab === 'DASHBOARD' ? 'text-primary' : 'text-secondary'}`} 
                    style={{ borderBottom: activeTab === 'DASHBOARD' ? '2px solid var(--primary)' : '2px solid transparent', background: 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none', cursor: 'pointer' }}
                    onClick={() => setActiveTab('DASHBOARD')}
                >
                    Dashboard
                </button>
                <button 
                    className={`pb-2 px-1 font-bold ${activeTab === 'ALL_TICKETS' ? 'text-primary' : 'text-secondary'}`} 
                    style={{ borderBottom: activeTab === 'ALL_TICKETS' ? '2px solid var(--primary)' : '2px solid transparent', background: 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none', cursor: 'pointer' }}
                    onClick={() => setActiveTab('ALL_TICKETS')}
                >
                    {isAdmin ? 'All Tickets' : 'Assigned Tickets'}
                </button>
                {isAdmin && (
                    <>
                        <button 
                            className={`pb-2 px-1 font-bold ${activeTab === 'TECHNICIANS' ? 'text-primary' : 'text-secondary'}`} 
                            style={{ borderBottom: activeTab === 'TECHNICIANS' ? '2px solid var(--primary)' : '2px solid transparent', background: 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none', cursor: 'pointer' }}
                            onClick={() => setActiveTab('TECHNICIANS')}
                        >
                            Technicians
                        </button>
                        <button 
                            className={`pb-2 px-1 font-bold ${activeTab === 'REPORTS' ? 'text-primary' : 'text-secondary'}`} 
                            style={{ borderBottom: activeTab === 'REPORTS' ? '2px solid var(--primary)' : '2px solid transparent', background: 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none', cursor: 'pointer' }}
                            onClick={() => setActiveTab('REPORTS')}
                        >
                            Reports
                        </button>
                    </>
                )}
            </div>
        );
    };

    return (
        <div className="fade-in">
            {user?.role?.toUpperCase() !== 'ADMIN' && (
                <div style={{ position: 'relative', marginBottom: '2rem' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            width: '56px', height: '56px', borderRadius: '50%',
                            background: 'linear-gradient(135deg, #166534, #22C55E)',
                            marginBottom: '0.75rem',
                            boxShadow: '0 4px 18px rgba(22,101,52,0.3)'
                        }}>
                            <Headset size={26} color="white" />
                        </div>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 0.35rem' }}>
                            Service Desk
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0' }}>
                            {user?.role?.toUpperCase() === 'USER' 
                                ? "Track and manage your submitted campus incidents and support requests."
                                : "Track and manage campus-wide incidents and support requests."}
                        </p>
                        <div className="mt-4 flex justify-center gap-4">
                            <button className="p-btn p-btn-secondary" onClick={handleRefresh} style={{ padding: '0.4rem 1rem' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: '0.5rem'}}><path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
                                Refresh List
                            </button>
                        </div>
                    </div>
                    
                    <div style={{ position: 'absolute', top: '10%', right: '0', transform: 'translateY(-50%)' }}>
                        <button className="p-btn p-btn-primary" onClick={() => setIsFormOpen(true)} style={{ padding: '0.6rem 1.5rem', fontWeight: 'bold' }}>
                            + Create Ticket
                        </button>
                    </div>
                </div>
            )}

            {renderTabs()}

            {/* Admin and Technician specific views */}
            {user?.role?.toUpperCase() === 'ADMIN' && (
                renderSummaryCards()
            )}

            {activeTab === 'DASHBOARD' && user?.role?.toUpperCase() === 'TECHNICIAN' && (
                <div>
                    {renderSummaryCards()}
                </div>
            )}

            {activeTab === 'TECHNICIANS' && (
                <div className="p-card text-center py-12 mb-8 text-secondary">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ opacity: 0.5, marginBottom: '1rem' }}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    <p>Technician management and workload distribution will appear here.</p>
                </div>
            )}

            {activeTab === 'REPORTS' && (
                <div className="p-card text-center py-12 mb-8 text-secondary">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ opacity: 0.5, marginBottom: '1rem' }}><path d="M3 3v18h18"/><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/></svg>
                    <p>System reports, average resolution times, and performance analytics will appear here.</p>
                </div>
            )}
            
            {(activeTab === 'ALL_TICKETS' || activeTab === 'DASHBOARD' || user?.role?.toUpperCase() === 'USER') && (
                <>
                    <div className="p-card mb-8" style={{ padding: '1.25rem' }}>
                        <div className="flex flex-wrap gap-4">
                            <input type="text" className="p-input flex-1" style={{ padding: '0.6rem 1rem', minWidth: '200px' }} placeholder="Search tickets..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                            <select className="p-input" style={{ padding: '0.6rem 1rem', minWidth: '150px' }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                                <option value="ALL">All Statuses</option>
                                <option value="OPEN">Open</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="RESOLVED">Resolved</option>
                                <option value="CLOSED">Closed</option>
                                <option value="REJECTED">Rejected</option>
                            </select>
                            <select className="p-input" style={{ padding: '0.6rem 1rem', minWidth: '150px' }} value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}>
                                <option value="ALL">All Priorities</option>
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                                <option value="URGENT">Urgent</option>
                            </select>
                            <select className="p-input" style={{ padding: '0.6rem 1rem', minWidth: '150px' }} value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
                                <option value="ALL">All Categories</option>
                                <option value="MAINTENANCE">Maintenance</option>
                                <option value="IT_SUPPORT">IT Support</option>
                                <option value="ELECTRICAL">Electrical</option>
                                <option value="PLUMBING">Plumbing</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>
                    </div>

            <TicketForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSuccess={fetchTickets} />
            {selectedTicketId && <TicketDetails ticketId={selectedTicketId} onClose={() => setSelectedTicketId(null)} onUpdate={fetchTickets} />}

            {user?.role?.toUpperCase() === 'ADMIN' ? (
                <div className="p-card">
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>All Incident Tickets</h3>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                                    <th style={{ padding: '1.25rem 1.5rem' }}>Ticket ID</th>
                                    <th style={{ padding: '1.25rem 1.5rem' }}>Reporter</th>
                                    <th style={{ padding: '1.25rem 1.5rem' }}>Location</th>
                                    <th style={{ padding: '1.25rem 1.5rem' }}>Priority</th>
                                    <th style={{ padding: '1.25rem 1.5rem' }}>Status</th>
                                    <th style={{ padding: '1.25rem 1.5rem' }}>Technician</th>
                                    <th style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="7" className="text-center py-8">Loading...</td></tr>
                                ) : filteredTickets.length === 0 ? (
                                    <tr><td colSpan="7" className="text-center py-8 text-secondary">No tickets found.</td></tr>
                                ) : (
                                    filteredTickets.map(t => (
                                        <tr key={t.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                            <td style={{ padding: '1.25rem 1.5rem', fontWeight: '700', fontSize: '0.9rem' }}>
                                                TKT-{t.id ? t.id.toString().substring(Math.max(0, t.id.toString().length - 4)) : '????'}
                                            </td>
                                            <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{t.creator?.name || 'Unknown'}</td>
                                            <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{t.location || 'Not specified'}</td>
                                            <td style={{ padding: '1.25rem 1.5rem' }}><span className={`badge ${getPriorityBadgeClass(t.priority)}`} style={{ fontSize: '0.65rem' }}>{t.priority}</span></td>
                                            <td style={{ padding: '1.25rem 1.5rem' }}><span className={`badge ${getStatusBadgeClass(t.status)}`} style={{ fontSize: '0.65rem' }}>{t.status}</span></td>
                                            <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{t.assignee?.name || 'Not Assigned'}</td>
                                            <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                                                <button className="p-btn p-btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }} onClick={() => setSelectedTicketId(t.id)}>View</button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="grid" style={{ gap: '1rem' }}>
                    {loading ? (
                        [1, 2, 3].map(i => <div key={i} className="skeleton skeleton-card"></div>)
                    ) : filteredTickets.length === 0 ? (
                        <div className="p-card text-center py-12">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ color: 'var(--text-secondary)', marginBottom: '1rem', opacity: 0.5 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                            <h3 className="text-secondary">No tickets found matching your filters.</h3>
                        </div>
                    ) : (
                        filteredTickets.map(t => (
                            <div key={t.id} className={`p-card ticket-card priority-${(t.priority || 'LOW').toLowerCase()}`} 
                                 style={{ padding: '1.25rem', cursor: 'pointer' }}
                                 onClick={() => setSelectedTicketId(t.id)}>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex flex-col gap-1 w-full">
                                        <div className="flex justify-between items-center w-full">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs font-bold text-secondary">#{t.id}</span>
                                                <span className="text-xs text-secondary">•</span>
                                                <span className="text-xs text-secondary font-bold uppercase">{t.category || 'OTHER'}</span>
                                            </div>
                                            {(user?.role?.toUpperCase() === 'ADMIN' || t.creator?.id === user.id) && (
                                                <button 
                                                    className="p-btn p-btn-secondary" 
                                                    style={{ padding: '0', width: '28px', height: '28px', color: 'var(--danger)', border: 'none', background: 'rgba(239, 68, 68, 0.05)' }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteTicket(t.id);
                                                    }}
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/></svg>
                                                </button>
                                            )}
                                        </div>
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.5rem' }} className="truncate">{(t.description || '').substring(0, 80)}{(t.description || '').length > 80 ? '...' : ''}</h3>
                                        
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`badge ${getStatusBadgeClass(t.status)}`}>{t.status}</span>
                                            <span className={`badge ${getPriorityBadgeClass(t.priority)}`}>{t.priority}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex justify-between items-center mt-6 pt-4" style={{ borderTop: '1px solid var(--border-color)', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    <div className="flex items-center gap-4 flex-wrap">
                                        <div className="flex items-center gap-1 text-xs text-secondary">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                            <span>{t.creator?.name || 'Unknown'}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-secondary">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                                            <span>{new Date(t.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {(t.attachment1 || t.attachment2 || t.attachment3) && (
                                            <div className="flex items-center gap-1 text-xs text-secondary" title="Attachments">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                                                <span>{[t.attachment1, t.attachment2, t.attachment3].filter(Boolean).length}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-1 text-xs text-secondary" title="Comments">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                                            <span>Click to view</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
            </>
            )}
        </div>
    );
};

export default Tickets;

