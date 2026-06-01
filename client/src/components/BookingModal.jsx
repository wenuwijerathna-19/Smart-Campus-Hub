import React, { useState } from 'react';
import api from '../services/api';

const BookingModal = ({ isOpen, onClose, resource }) => {
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        startTime: '09:00',
        endTime: '10:00',
        purpose: '',
        expectedAttendees: 1,
        contactNumber: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    if (!isOpen || !resource) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validate time range
        if (formData.startTime < '08:00' || formData.startTime > '19:00' ||
            formData.endTime < '08:00' || formData.endTime > '19:00') {
            setError('Bookings are only allowed between 08:00 AM and 07:00 PM.');
            return;
        }

        if (formData.startTime >= formData.endTime) {
            setError('End time must be after start time.');
            return;
        }

        // Validate contact number (10 digits)
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(formData.contactNumber)) {
            setError('Please enter a valid 10-digit mobile number (e.g., 0771234567).');
            return;
        }

        try {
            // Combine date and time
            const startDateTime = `${formData.date}T${formData.startTime}:00`;
            const endDateTime = `${formData.date}T${formData.endTime}:00`;

            await api.post('/bookings', {
                resource: { id: resource.id },
                startTime: startDateTime,
                endTime: endDateTime,
                purpose: formData.purpose,
                expectedAttendees: formData.expectedAttendees,
                contactNumber: formData.contactNumber
            });
            setSuccess('Booking requested successfully!');
            setTimeout(onClose, 2000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to request booking');
        }
    };
    //Limit the data and time
    const today = new Date().toISOString().split('T')[0];
    const tenDaysFromNow = new Date();
    tenDaysFromNow.setDate(tenDaysFromNow.getDate() + 10);
    const maxDate = tenDaysFromNow.toISOString().split('T')[0];

    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/\D/g, ''); // Remove all non-numeric characters
        if (value.length <= 10) {
            setFormData({ ...formData, contactNumber: value });
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', zIndex: 50,
            backdropFilter: 'blur(4px)'
        }}>
            <div className="p-card" style={{ width: '400px', maxWidth: '90%' }}>
                <h2 className="mb-2">Book {resource.name}</h2>
                <p className="mb-4" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Submit a request to reserve this resource.</p>
                {error && <div className="mb-4" style={{ color: 'var(--danger)', fontSize: '0.875rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '8px', borderRadius: '4px' }}>{error}</div>}
                {success && <div className="mb-4" style={{ color: 'var(--success)', fontSize: '0.875rem', backgroundColor: 'rgba(34, 197, 94, 0.1)', padding: '8px', borderRadius: '4px' }}>{success}</div>}
                {/*booking form */}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="p-label">Date</label>
                        <input
                            type="date"
                            className="p-input"
                            min={today}
                            max={maxDate}
                            value={formData.date}
                            onChange={e => setFormData({ ...formData, date: e.target.value })}
                            required
                        />
                    </div> {/*Input constrain 106 107 */}
                    <div className="flex gap-4 mb-4">
                        <div className="w-full">
                            <label className="p-label">Start Time</label>
                            <input
                                type="time"
                                className="p-input"
                                min="08:00"
                                max="19:00"
                                value={formData.startTime}
                                onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                                required
                            />
                        </div>
                        <div className="w-full">
                            <label className="p-label">End Time</label>
                            <input
                                type="time"
                                className="p-input"
                                min="08:00"
                                max="19:00"
                                value={formData.endTime}
                                onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: '-0.5rem' }}>
                        Note: Facilities are available from 08:00 AM to 07:00 PM within a 10-day window.
                    </p>
                    <div className="mb-4">
                        <label className="p-label">Mobile Number</label>
                        <input
                            type="text"
                            className="p-input"
                            placeholder="e.g. 0771234567"
                            value={formData.contactNumber}
                            onChange={handlePhoneChange}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="p-label">Purpose</label>
                        <input className="p-input" placeholder="e.g. Lecture, Workshop" value={formData.purpose} onChange={e => setFormData({ ...formData, purpose: e.target.value })} required />
                    </div>
                    {resource.type !== 'EQUIPMENT' && (
                        <div className="mb-4">
                            <label className="p-label">Expected Attendees</label>
                            <input type="number" min="1" max={resource.capacity || 100} className="p-input" value={formData.expectedAttendees} onChange={e => setFormData({ ...formData, expectedAttendees: parseInt(e.target.value) })} required />
                        </div>
                    )}
                    <div className="flex justify-end gap-4 mt-4">
                        <button type="button" className="p-btn p-btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="p-btn p-btn-primary">Request</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookingModal;
