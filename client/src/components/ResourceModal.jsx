import React, { useState, useEffect } from 'react';

const ResourceModal = ({ isOpen, onClose, onSave, resource }) => {
    const [formData, setFormData] = useState({
        name: '', type: 'ROOM', capacity: 0, location: '', status: 'ACTIVE', imageUrl: ''
    });

    useEffect(() => {
        if (resource) {
            setFormData({
                ...resource,
                imageUrl: resource.imageUrl || ''
            });
        } else {
            setFormData({ name: '', type: 'ROOM', capacity: 0, location: '', status: 'ACTIVE', imageUrl: '' });
        }
    }, [resource, isOpen]);

    if (!isOpen) return null;

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, imageUrl: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', zIndex: 100,
            backdropFilter: 'blur(4px)'
        }}>
            <div className="p-card" style={{ width: '450px', maxWidth: '95%', maxHeight: '90vh', overflowY: 'auto' }}>
                <h2 className="mb-4">{resource ? 'Edit Resource' : 'Add New Resource'}</h2>
                <form onSubmit={handleSubmit}>
                
                    <div className="mb-4">
                        <label className="p-label">Name</label>
                        <input className="p-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                    </div>
                    <div className="mb-4 flex gap-4">
                        <div className="w-full">
                            <label className="p-label">Type</label>
                            <select className="p-input" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                                <option value="ROOM">Room</option>
                                <option value="LAB">Lab</option>
                                <option value="EQUIPMENT">Equipment</option>
                            </select>
                        </div>
                        <div className="w-full">
                            <label className="p-label">Capacity</label>
                            <input className="p-input" type="number" value={formData.capacity} onChange={e => setFormData({...formData, capacity: parseInt(e.target.value)})} />
                        </div>
                    </div>
                
                    <div className="mb-4">
                        <label className="p-label">Location</label>
                        <input className="p-input" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required />
                    </div>
                    <div className="mb-4">
                        <label className="p-label">Status</label>
                        <select className="p-input" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                            <option value="ACTIVE">Active</option>
                            <option value="OUT_OF_SERVICE">Out of Service</option>
                        </select>
                    </div>
                    <div className="mb-6">
                        <label className="p-label">Resource Photo</label>
                        <input 
                            type="file"
                            accept="image/*"
                            className="p-input" 
                            onChange={handleImageUpload} 
                        />
                        {formData.imageUrl && (
                            <div style={{ marginTop: '10px' }}>
                                <img 
                                    src={formData.imageUrl} 
                                    alt="Preview" 
                                    style={{ width: '100px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border-color)' }} 
                                />
                            </div>
                        )}
                        <p style={{ fontSize: '0.75rem', marginTop: '0.25rem', color: 'var(--text-secondary)' }}>Upload a photo or leave and the default pattern will be used.</p>
                    </div>
                    <div className="flex justify-end gap-4 mt-4">
                        <button type="button" className="p-btn p-btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="p-btn p-btn-primary">Save Resource</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResourceModal;
