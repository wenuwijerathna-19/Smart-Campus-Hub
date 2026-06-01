import React from 'react';
import { Calendar, Monitor, MapPin, Users, Building2 } from 'lucide-react';

const ResourceCard = ({ resource, onBook, onEdit, onDelete, isAdmin }) => {
    const getPatternImage = (res) => {
        if (res.imageUrl && res.imageUrl.trim() !== '') return res.imageUrl;
        if (res.type === 'ROOM') return '/images/lecture.png';
        if (res.type === 'LAB') return '/images/tech.png';
        return '/images/library.png';
    };

    return (
        <div className="p-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '0', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            <div style={{ height: '180px', width: '100%', backgroundImage: `url(${getPatternImage(resource)})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: '#e2e8f0', borderBottom: '1px solid var(--border-color)' }} />
            
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div className="flex justify-between items-center mb-4">
                    <h3 style={{ fontSize: '1.125rem', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                        {resource.name}
                    </h3>
                <span style={{
                    fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px',
                    backgroundColor: resource.status === 'ACTIVE' ? 'var(--success)' : 'var(--danger)',
                    color: 'white', fontWeight: 'bold'
                }}>
                    {resource.status}
                </span>
            </div>
            
            <div style={{ flex: 1, marginBottom: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                <p style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}><MapPin size={16} color="var(--primary)"/> {resource.location}</p>
                <p style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}><Users size={16} color="var(--primary)"/> Capacity: {resource.capacity || 'N/A'}</p>
                <p style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {resource.type === 'ROOM' ? <Building2 size={16} color="var(--primary)"/> : 
                     resource.type === 'LAB' ? <Monitor size={16} color="var(--primary)"/> : 
                     <Calendar size={16} color="var(--primary)"/>}
                    Type: {resource.type}
                </p>
            </div>

                <div className="flex justify-end gap-2" style={{ marginTop: 'auto' }}>
                    {!isAdmin && (
                        <button 
                            className="p-btn p-btn-primary" 
                            onClick={() => onBook(resource)}
                            disabled={resource.status !== 'ACTIVE'}
                            style={{ opacity: resource.status !== 'ACTIVE' ? 0.5 : 1, width: '100%' }}
                        >
                            Book Now
                        </button>
                    )}
                    {isAdmin && (
                        <>
                            <button className="p-btn p-btn-secondary" onClick={() => onEdit(resource)}>
                                Edit
                            </button>
                            <button className="p-btn" style={{ backgroundColor: 'var(--danger)', color: 'white', border: 'none' }} onClick={() => {
                                const id = resource.id || resource._id;
                                if (id) onDelete(id);
                                else alert("Cannot delete: Resource ID missing.");
                            }}>
                                Delete
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResourceCard;
