import React, { useState, useEffect, useContext } from 'react';
import { Phone, X, FileDown } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const AdminBookings = () => {
    const { user } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedContact, setSelectedContact] = useState(null);
    const [filter, setFilter] = useState('valid'); // 'valid' | 'expired'

    const fetchBookings = async () => {
        if (!user) return;
        try {
            const res = await api.get('/bookings');
            setBookings(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, [user]);

    const handleStatus = async (id, status) => {
        try {
            await api.put(`/bookings/${id}/status`, { status, reason: 'Admin Action' });
            fetchBookings();
        } catch (err) {
            alert('Action failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this booking record?')) return;
        try {
            await api.delete(`/bookings/${id}`);
            fetchBookings();
        } catch (err) {
            console.error(err);
            alert('Failed to delete: ' + (err.response?.data?.message || err.message));
        }
    };

    if (!user) return <div className="p-card text-center py-12">Please login to manage bookings.</div>;
    if (loading) return <div className="text-center mt-4">Loading bookings...</div>;
{/*Filter Logic*/}
    const isBookingExpired = (b) => {
        const end = b.endTime || b.startTime;
        return end && new Date(end) < new Date();
    };

    const isBookingInactive = (b) => {
        return isBookingExpired(b) || b.status === 'CANCELLED' || b.status === 'REJECTED';
    };

    const validBookings = bookings.filter(b => !isBookingInactive(b));
    const expiredBookings = bookings.filter(b => isBookingInactive(b));

    const displayBookings = filter === 'valid'
        ? [...validBookings].sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
        : [...expiredBookings].sort((a, b) => new Date(b.startTime) - new Date(a.startTime));

    const tabStyle = (active) => ({
        padding: '0.4rem 1.1rem',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer',
        fontWeight: '700',
        fontSize: '0.875rem',
        transition: 'all 0.2s',
        background: active ? 'var(--primary)' : 'transparent',
        color: active ? 'white' : 'var(--text-secondary)',
        boxShadow: active ? '0 2px 8px rgba(16,185,129,0.3)' : 'none',
    });

    const generatePDF = () => {
        const doc = new jsPDF();
        const now = new Date().toLocaleString();

        // ── Primary: #166534  |  Secondary: #22C55E  ────────────────
        const primaryRGB  = [22, 101, 52];   // #166534
        const secondaryRGB = [34, 197, 94];  // #22C55E
        const lightGreenRGB = [240, 253, 244]; // very light green tint for alt rows

        // Header background — deep green
        doc.setFillColor(...primaryRGB);
        doc.rect(0, 0, 210, 34, 'F');

        // Accent stripe — lighter green
        doc.setFillColor(...secondaryRGB);
        doc.rect(0, 34, 210, 3, 'F');

        // Title text (white on dark green)
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text('Smart Campus Hub', 14, 14);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('Valid Bookings Report', 14, 24);

        // Generated date — top-right
        doc.setFontSize(8);
        doc.text(`Generated: ${now}`, 196, 24, { align: 'right' });

        // Summary row below accent stripe
        doc.setFillColor(...lightGreenRGB);
        doc.rect(0, 37, 210, 12, 'F');
        doc.setTextColor(...primaryRGB);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(`Total Valid Bookings: ${validBookings.length}`, 14, 44);
        doc.setFont('helvetica', 'normal');

        // Table
        autoTable(doc, {
            startY: 52,
            head: [['#', 'User', 'Resource', 'Date & Time', 'Status', 'Contact']],
            body: validBookings.map((b, i) => [
                i + 1,
                b.user?.name || 'Unknown User',
                b.resource?.name || 'Unknown Resource',
                b.startTime ? new Date(b.startTime).toLocaleString() : 'N/A',
                b.status,
                b.contactNumber || 'N/A'
            ]),
            headStyles: {
                fillColor: primaryRGB,
                textColor: [255, 255, 255],
                fontStyle: 'bold',
                fontSize: 10,
                cellPadding: 5,
            },
            alternateRowStyles: { fillColor: lightGreenRGB },
            bodyStyles: { textColor: [31, 41, 55], fontSize: 9, cellPadding: 4 },
            columnStyles: {
                0: { halign: 'center', cellWidth: 10 },
                4: { halign: 'center', textColor: primaryRGB, fontStyle: 'bold' },
            },
            margin: { left: 14, right: 14 },
            tableLineColor: [229, 231, 235],
            tableLineWidth: 0.1,
        });

        // Footer green line + text
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFillColor(...secondaryRGB);
            doc.rect(0, 286, 210, 1.5, 'F');
            doc.setFontSize(8);
            doc.setTextColor(...primaryRGB);
            doc.text(`Page ${i} of ${pageCount}  |  Smart Campus Hub — Valid Bookings`, 105, 292, { align: 'center' });
        }

        doc.save(`valid-bookings-${Date.now()}.pdf`);
    };

    return (
        <div className="p-card">
            {/* Header row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <h2 style={{ margin: 0 }}>Manage Bookings</h2>
                    {filter === 'valid' && (
                        <button
                            onClick={generatePDF}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.4rem',
                                padding: '0.4rem 0.9rem', borderRadius: '8px',
                                background: 'var(--primary)', color: 'white',
                                border: 'none', cursor: 'pointer', fontWeight: '700',
                                fontSize: '0.82rem', boxShadow: '0 2px 8px rgba(16,185,129,0.35)',
                                transition: 'transform 0.15s'
                            }}
                            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.04)'}
                            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <FileDown size={15} /> Download PDF
                        </button>
                    )}
                </div>{/*Filter Logic*/}
                <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-secondary, #f3f4f6)', padding: '0.3rem', borderRadius: '10px' }}>
                    <button style={tabStyle(filter === 'valid')} onClick={() => setFilter('valid')}>
                        Valid
                        <span style={{ marginLeft: '0.4rem', background: filter === 'valid' ? 'rgba(255,255,255,0.3)' : 'var(--border-color)', borderRadius: '99px', padding: '1px 7px', fontSize: '0.78rem' }}>
                            {validBookings.length}
                        </span>
                    </button>
                    <button style={tabStyle(filter === 'expired')} onClick={() => setFilter('expired')}>
                        Expired
                        <span style={{ marginLeft: '0.4rem', background: filter === 'expired' ? 'rgba(255,255,255,0.3)' : 'var(--border-color)', borderRadius: '99px', padding: '1px 7px', fontSize: '0.78rem' }}>
                            {expiredBookings.length}
                        </span>
                    </button>
                </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <th style={{ padding: '0.75rem' }}>User</th>
                            <th>Resource</th>
                            <th>Time</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayBookings.length === 0 && (
                            <tr>
                                <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                    No {filter} bookings found.
                                </td>
                            </tr>
                        )}
                        {displayBookings.map(b => {
                            const expired = isBookingExpired(b);
                            const inactive = isBookingInactive(b);

                            const statusColor = {
                                APPROVED: '#10B981',
                                PENDING: '#F59E0B',
                                REJECTED: '#EF4444',
                                CANCELLED: '#6B7280',
                            }[b.status] || '#6B7280';

                            return (
                                <tr key={b.id} style={{ borderBottom: '1px solid var(--border-color)', opacity: inactive ? 0.75 : 1 }}>
                                    <td style={{ padding: '0.75rem' }}>{b.user?.name || 'Unknown User'}</td>
                                    <td>{b.resource?.name || 'Unknown Resource'}</td>
                                    <td>{b.startTime ? new Date(b.startTime).toLocaleString() : 'N/A'}</td>
                                    <td>
                                        <span style={{
                                            padding: '2px 8px',
                                            borderRadius: '6px',
                                            background: expired ? '#EF4444' : statusColor,
                                            color: 'white',
                                            fontSize: '0.72rem',
                                            fontWeight: 'bold',
                                            letterSpacing: '0.5px'
                                        }}>
                                            {expired ? 'EXPIRED' : b.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                            {/* Approve/Reject — only for non-expired PENDING */}
                                            {b.status === 'PENDING' && !expired && (
                                                <>
                                                    <button className="p-btn p-btn-primary" style={{ padding: '0.25rem 0.5rem', background: 'var(--success)', border: 'none' }} onClick={() => handleStatus(b.id, 'APPROVED')}>Approve</button>
                                                    <button className="p-btn p-btn-primary" style={{ padding: '0.25rem 0.5rem', background: 'var(--danger)', border: 'none' }} onClick={() => handleStatus(b.id, 'REJECTED')}>Reject</button>
                                                </>
                                            )}

                                            {/* Delete — only for expired / inactive */}
                                            {inactive && (
                                                <button className="p-btn" style={{ padding: '0.25rem 0.5rem', background: 'var(--danger)', color: 'white', border: 'none' }} onClick={() => handleDelete(b.id)}>Delete</button>
                                            )}

                                            {/* Contact — only for non-expired bookings */}
                                            {!expired && (
                                                <button
                                                    style={{
                                                        padding: '0.35rem',
                                                        background: 'var(--primary)',
                                                        border: 'none',
                                                        borderRadius: '6px',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: 'white',
                                                        boxShadow: '0 2px 6px rgba(16,185,129,0.35)',
                                                        transition: 'transform 0.15s'
                                                    }}
                                                    title="View Contact Number"
                                                    onClick={() => setSelectedContact({ name: b.user?.name || 'Unknown User', number: b.contactNumber || 'Not provided' })}
                                                >
                                                    <Phone size={15} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Glassmorphism Contact Modal */}
            {selectedContact && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.35)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', zIndex: 100,
                    backdropFilter: 'blur(6px)'
                }}>
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.88)',
                        backdropFilter: 'blur(20px)',
                        padding: '2.5rem 2.25rem',
                        borderRadius: '24px',
                        boxShadow: '0 12px 50px rgba(0,0,0,0.18)',
                        border: '1px solid rgba(255,255,255,0.6)',
                        textAlign: 'center',
                        minWidth: '320px',
                        position: 'relative',
                        animation: 'fadeIn 0.2s ease'
                    }}>
                        <button
                            onClick={() => setSelectedContact(null)}
                            style={{ position: 'absolute', top: '14px', right: '14px', background: 'rgba(0,0,0,0.06)', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: '6px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            <X size={17} />
                        </button>
                        <div style={{ background: 'var(--primary)', color: 'white', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', boxShadow: '0 4px 18px rgba(16,185,129,0.45)' }}>
                            <Phone size={28} />
                        </div>
                        <p style={{ margin: '0 0 0.4rem 0', fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Contact Number</p>
                        <p style={{ margin: 0, fontSize: '2rem', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '2px' }}>
                            {selectedContact.number}
                        </p>
                        <p style={{ margin: '1rem 0 0 0', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                            Booking by: <strong style={{ color: 'var(--text-primary)' }}>{selectedContact.name}</strong>
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminBookings;
