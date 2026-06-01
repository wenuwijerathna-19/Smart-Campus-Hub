import React, { useState, useEffect } from 'react';
import { CalendarCheck, Clock, XCircle, CheckCircle, AlertCircle, Trash2, Ban, FileDown } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import api from '../services/api';

const statusConfig = {
    APPROVED: { color: '#166534', bg: 'rgba(22,101,52,0.1)', icon: <CheckCircle size={14} />, label: 'Approved' },
    PENDING: { color: '#D97706', bg: 'rgba(217,119,6,0.1)', icon: <Clock size={14} />, label: 'Pending' },
    REJECTED: { color: '#EF4444', bg: 'rgba(239,68,68,0.1)', icon: <XCircle size={14} />, label: 'Rejected' },
    CANCELLED: { color: '#6B7280', bg: 'rgba(107,114,128,0.1)', icon: <Ban size={14} />, label: 'Cancelled' },
    EXPIRED: { color: '#EF4444', bg: 'rgba(239,68,68,0.1)', icon: <AlertCircle size={14} />, label: 'Expired' },
};

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    //fetch data
    const fetchBookings = async () => {
        try {
            const res = await api.get('/bookings/my');
            setBookings(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBookings(); }, []);

    const handleCancel = async (id) => {
        try {
            await api.put(`/bookings/${id}/cancel`);
            fetchBookings();
        } catch (err) {
            alert('Failed to cancel');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this booking record?')) return;
        try {
            await api.delete(`/bookings/${id}`);
            fetchBookings();
        } catch (err) {
            alert('Failed to delete');
        }
    };
    //genarate PDF
    const generateBookingPDF = (b) => {
        const doc = new jsPDF();
        const primary = [22, 101, 52];   // #166534
        const secondary = [34, 197, 94];   // #22C55E
        const lightGreen = [240, 253, 244];
        const textDark = [31, 41, 55];
        const textGray = [75, 85, 99];
        const refNum = `SCH-${b.id?.slice(-8).toUpperCase() || 'XXXXXXXX'}`;

        // ── Header band ───────────────────────────────────────────
        doc.setFillColor(...primary);
        doc.rect(0, 0, 210, 38, 'F');
        doc.setFillColor(...secondary);
        doc.rect(0, 38, 210, 3, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(20); doc.setFont('helvetica', 'bold');
        doc.text('Smart Campus Hub', 14, 16);
        doc.setFontSize(11); doc.setFont('helvetica', 'normal');
        doc.text('Booking Confirmation', 14, 27);
        doc.setFontSize(8);
        doc.text(`Ref: ${refNum}`, 196, 27, { align: 'right' });

        // ── "APPROVED" stamp ──────────────────────────────────────
        doc.setFillColor(240, 253, 244);
        doc.roundedRect(14, 46, 182, 18, 3, 3, 'F');
        doc.setFontSize(13); doc.setFont('helvetica', 'bold');
        doc.setTextColor(...primary);
        doc.text('BOOKING APPROVED', 105, 58, { align: 'center' });

        // ── Details table ─────────────────────────────────────────
        autoTable(doc, {
            startY: 72,
            head: [['Field', 'Details']],
            body: [
                ['Booking Reference', refNum],
                ['Resource / Facility', b.resource?.name || 'Unknown Resource'],
                ['Booked By', b.user?.name || 'N/A'],
                ['Contact Number', b.contactNumber || 'N/A'],
                ['Start Date & Time', b.startTime ? new Date(b.startTime).toLocaleString() : 'N/A'],
                ['End Date & Time', b.endTime ? new Date(b.endTime).toLocaleString() : 'N/A'],
                ['Purpose', b.purpose || 'N/A'],
                ['Expected Attendees', b.expectedAttendees != null ? String(b.expectedAttendees) : 'N/A'],
                ['Status', 'APPROVED'],
                ['Generated On', new Date().toLocaleString()],
            ],
            headStyles: {
                fillColor: primary, textColor: [255, 255, 255],
                fontStyle: 'bold', fontSize: 10, cellPadding: 5,
            },
            alternateRowStyles: { fillColor: lightGreen },
            bodyStyles: { textColor: textDark, fontSize: 10, cellPadding: 5 },
            columnStyles: {
                0: { fontStyle: 'bold', cellWidth: 60, textColor: textGray },
                1: { cellWidth: 122 },
            },
            margin: { left: 14, right: 14 },
            tableLineColor: [229, 231, 235],
            tableLineWidth: 0.1,
        });

        // ── Note box ─────────────────────────────────────────────
        const finalY = doc.lastAutoTable.finalY + 8;
        doc.setFillColor(240, 253, 244);
        doc.roundedRect(14, finalY, 182, 20, 3, 3, 'F');
        doc.setDrawColor(...secondary);
        doc.setLineWidth(0.5);
        doc.roundedRect(14, finalY, 182, 20, 3, 3, 'S');
        doc.setFontSize(8.5); doc.setFont('helvetica', 'italic');
        doc.setTextColor(...textGray);
        doc.text('Please present this confirmation at the facility entrance. This document is auto-generated by Smart Campus Hub.', 105, finalY + 8, { align: 'center', maxWidth: 170 });
        doc.text('Any misuse of this booking may result in cancellation.', 105, finalY + 15, { align: 'center' });

        // ── Footer line ──────────────────────────────────────────
        const pages = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pages; i++) {
            doc.setPage(i);
            doc.setFillColor(...secondary);
            doc.rect(0, 286, 210, 1.5, 'F');
            doc.setFontSize(8); doc.setTextColor(...primary); doc.setFont('helvetica', 'normal');
            doc.text(`Page ${i} of ${pages}  |  Smart Campus Hub — Booking Confirmation`, 105, 292, { align: 'center' });
        }

        doc.save(`booking-confirmation-${refNum}.pdf`);
    };


    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', color: 'var(--text-secondary)' }}>
            <Clock size={20} style={{ marginRight: '0.5rem', color: 'var(--primary)' }} /> Loading bookings...
        </div>
    );

    const sortedBookings = [...bookings].sort((a, b) => {
        const aEnd = a.endTime || a.startTime;
        const bEnd = b.endTime || b.startTime;
        const aInactive = (new Date(aEnd) < new Date() || a.status === 'CANCELLED' || a.status === 'REJECTED') ? 1 : 0;
        const bInactive = (new Date(bEnd) < new Date() || b.status === 'CANCELLED' || b.status === 'REJECTED') ? 1 : 0;
        if (aInactive !== bInactive) return aInactive - bInactive;
        return new Date(b.startTime) - new Date(a.startTime);
    });

    return (
        <div style={{ maxWidth: '780px', margin: '0 auto', padding: '0 1rem' }}>

            {/* ── Centered Header ───────────────────────────────── */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: '56px', height: '56px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #166534, #22C55E)',
                    marginBottom: '0.75rem',
                    boxShadow: '0 4px 18px rgba(22,101,52,0.3)'
                }}>
                    <CalendarCheck size={26} color="white" />
                </div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 0.35rem' }}>
                    My Bookings
                </h2> {/*contienue  html jsx part*/}
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                    Track and manage your facility reservations
                </p>
            </div>

            {/* ── No bookings ───────────────────────────────────── */}
            {sortedBookings.length === 0 ? (
                <div style={{
                    textAlign: 'center', padding: '3rem 2rem',
                    background: 'var(--surface-color)', borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-secondary)'
                }}>
                    <CalendarCheck size={40} style={{ color: 'var(--border-color)', marginBottom: '1rem' }} />
                    <p style={{ fontWeight: '600' }}>No bookings found.</p>
                    <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>Book a facility to get started.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {sortedBookings.map(b => {
                        const end = b.endTime || b.startTime;
                        const isExpired = end && new Date(end) < new Date();
                        const isInactive = isExpired || b.status === 'CANCELLED' || b.status === 'REJECTED';
                        const statusKey = isExpired ? 'EXPIRED' : b.status;
                        const cfg = statusConfig[statusKey] || statusConfig.PENDING;

                        return (
                            <div key={b.id} style={{
                                background: 'var(--surface-color)',
                                border: `1px solid ${isInactive ? 'var(--border-color)' : 'rgba(22,101,52,0.2)'}`,
                                borderLeft: `4px solid ${cfg.color}`,
                                borderRadius: 'var(--radius-md)',
                                padding: '1.1rem 1.25rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                gap: '1rem',
                                opacity: isInactive ? 0.72 : 1,
                                transition: 'box-shadow 0.2s, transform 0.2s',
                                boxShadow: isInactive ? 'none' : 'var(--shadow-sm)',
                            }}
                                onMouseOver={e => { if (!isInactive) { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-2px)'; } }}
                                onMouseOut={e => { e.currentTarget.style.boxShadow = isInactive ? 'none' : 'var(--shadow-sm)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                            >
                                {/* Left — info */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <h4 style={{ margin: '0 0 6px 0', fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {b.resource?.name || 'Unknown Resource'}
                                    </h4>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Clock size={12} />
                                        {new Date(b.startTime).toLocaleString()} — {new Date(b.endTime).toLocaleString()}
                                    </p>
                                    {/* Status badge */}
                                    <span style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                                        padding: '3px 10px', borderRadius: '99px',
                                        background: cfg.bg, color: cfg.color,
                                        fontSize: '0.75rem', fontWeight: '700',
                                    }}>
                                        {cfg.icon} {cfg.label}
                                    </span>
                                </div>

                                {/* Right — action buttons */}
                                <div style={{ flexShrink: 0, display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    {/* PDF button — only for APPROVED non-expired */}
                                    {b.status === 'APPROVED' && !isExpired && (
                                        <button
                                            onClick={() => generateBookingPDF(b)}
                                            style={{
                                                display: 'inline-flex', alignItems: 'center', gap: '6px',
                                                padding: '0.45rem 1rem', borderRadius: 'var(--radius-md)',
                                                border: 'none', background: 'linear-gradient(135deg,#166534,#22C55E)',
                                                color: 'white', fontWeight: '700', fontSize: '0.82rem',
                                                cursor: 'pointer', transition: 'all 0.2s',
                                                boxShadow: '0 2px 10px rgba(22,101,52,0.35)'
                                            }}
                                            onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.04)'; }}
                                            onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                                            title="Download Booking Confirmation PDF"
                                        >
                                            <FileDown size={14} /> PDF
                                        </button>
                                    )}

                                    {(b.status === 'PENDING' || b.status === 'APPROVED') && !isExpired ? (
                                        <button
                                            onClick={() => handleCancel(b.id)}
                                            style={{
                                                display: 'inline-flex', alignItems: 'center', gap: '6px',
                                                padding: '0.45rem 1rem', borderRadius: 'var(--radius-md)',
                                                border: '1.5px solid var(--danger)', background: 'transparent',
                                                color: 'var(--danger)', fontWeight: '700', fontSize: '0.82rem',
                                                cursor: 'pointer', transition: 'all 0.2s'
                                            }}
                                            onMouseOver={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
                                            onMouseOut={e => { e.currentTarget.style.background = 'transparent'; }}
                                        >
                                            <Ban size={14} /> Cancel
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleDelete(b.id)}
                                            style={{
                                                display: 'inline-flex', alignItems: 'center', gap: '6px',
                                                padding: '0.45rem 1rem', borderRadius: 'var(--radius-md)',
                                                border: 'none', background: 'var(--danger)',
                                                color: 'white', fontWeight: '700', fontSize: '0.82rem',
                                                cursor: 'pointer', transition: 'all 0.2s',
                                                boxShadow: '0 2px 8px rgba(239,68,68,0.3)'
                                            }}
                                            onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.04)'; }}
                                            onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                                        >
                                            <Trash2 size={14} /> Delete Record
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MyBookings;
