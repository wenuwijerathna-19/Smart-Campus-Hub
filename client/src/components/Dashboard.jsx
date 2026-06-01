import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import ResourceCard from './ResourceCard';
import ResourceModal from './ResourceModal';
import BookingModal from './BookingModal';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingResource, setEditingResource] = useState(null);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [bookingResource, setBookingResource] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('ALL');

    const fetchResources = async () => {
        try {
            const res = await api.get('/resources');
            setResources(res.data);
        } catch (err) {
            console.error("Failed to fetch resources", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchResources();
        }
    }, [user]);

    if (!user) return <div className="p-card text-center py-12">Please login to view facilities.</div>;

    const handleSaveResource = async (formData) => {
        try {
            if (editingResource) {
                await api.put(`/resources/${formData.id}`, formData);
            } else {
                await api.post('/resources', formData);
            }
            setIsModalOpen(false);
            fetchResources();
        } catch (err) {
            console.error("Failed to save resource", err);
            alert("Error saving resource");
        }
    };

    const handleDeleteResource = async (id) => {
        if (!window.confirm('Are you sure you want to delete this resource?')) return;
        try {
            await api.delete(`/resources/${id}`);
            fetchResources();
        } catch (err) {
            console.error("Failed to delete resource", err);
            alert("Error deleting resource");
        }
    };

    const openEditModal = (resource) => {
        setEditingResource(resource);
        setIsModalOpen(true);
    };

    const openCreateModal = () => {
        setEditingResource(null);
        setIsModalOpen(true);
    };

    const handleBook = (resource) => {
        setBookingResource(resource);
        setIsBookingModalOpen(true);
    };

    if (loading) return <div className="text-center mt-4">Loading catalog...</div>;

    const filteredResources = Array.isArray(resources) ? resources.filter(res => {
        const matchesSearch = (res.name || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'ALL' || res.type === filterType;
        return matchesSearch && matchesType;
    }) : [];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2>Campus Facilities & Booking</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Browse and secure university facilities instantly.</p>
                </div>
                {user?.role === 'ADMIN' && (
                    <button className="p-btn p-btn-primary" onClick={openCreateModal}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ marginRight: '0.5rem' }}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        Add Resource
                    </button>
                )}
            </div>
            
            <ResourceModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                resource={editingResource} 
                onSave={handleSaveResource} 
            />

            <BookingModal 
                isOpen={isBookingModalOpen} 
                onClose={() => setIsBookingModalOpen(false)} 
                resource={bookingResource} 
            />

            <div className="flex gap-4" style={{ marginBottom: '2.5rem' }}>
                <input 
                    type="text" 
                    className="p-input" 
                    placeholder="Search resources..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ flex: 1 }}
                />
                <select 
                    className="p-input" 
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    style={{ width: '200px' }}
                >
                    <option value="ALL">All Types</option>
                    <option value="ROOM">Room</option>
                    <option value="LAB">Lab</option>
                    <option value="EQUIPMENT">Equipment</option>
                </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {filteredResources.map(res => (
                    <ResourceCard 
                        key={res.id} 
                        resource={res} 
                        isAdmin={user?.role === 'ADMIN'}
                        onEdit={openEditModal}
                        onBook={handleBook}
                        onDelete={handleDeleteResource}
                    />
                ))}
                {resources.length === 0 && (
                    <div className="p-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
                        No physical assets or rooms found in the catalog.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
