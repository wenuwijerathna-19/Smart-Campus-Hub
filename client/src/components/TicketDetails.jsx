import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const TicketDetails = ({ ticketId, onClose, onUpdate }) => {
    const { user } = useContext(AuthContext);
    const [ticket, setTicket] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [technicians, setTechnicians] = useState([]);
    const [isRejecting, setIsRejecting] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [resolutionNotes, setResolutionNotes] = useState('');
    const [isResolving, setIsResolving] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editContent, setEditContent] = useState('');

    const fetchTicketDetails = async () => {
        try {
            setLoading(true);
            console.log("Fetching details for ticket:", ticketId);
            const [ticketRes, commentsRes] = await Promise.all([
                api.get(`/tickets/${ticketId}`),
                api.get(`/tickets/${ticketId}/comments`)
            ]);
            
            if (!ticketRes.data) {
                throw new Error("No ticket data returned from server");
            }
            
            setTicket(ticketRes.data);
            setComments(commentsRes.data || []);
            setResolutionNotes(ticketRes.data.resolutionNotes || '');
            console.log("Ticket details loaded successfully");
        } catch (err) {
            console.error("Failed to fetch ticket details:");
            console.dir(err);
            const errMsg = err.response?.data?.error || err.message || "Unknown error";
            alert(`Could not load ticket details: ${errMsg}`);
            onClose();
        } finally {
            setLoading(false);
        }
    };

    const fetchTechnicians = async () => {
        if (user.role === 'ADMIN') {
            try {
                const res = await api.get('/users/technicians');
                setTechnicians(res.data);
            } catch (err) {
                console.error(err);
            }
        }
    };

    useEffect(() => {
        fetchTicketDetails();
        fetchTechnicians();
    }, [ticketId]);

    const handleComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        try {
            await api.post(`/tickets/${ticketId}/comments`, { content: newComment });
            setNewComment('');
            const res = await api.get(`/tickets/${ticketId}/comments`);
            setComments(res.data);
        } catch (err) {
            alert('Failed to post comment');
        }
    };

    const handleEditComment = async (commentId) => {
        if (!editContent.trim()) return;
        try {
            await api.put(`/tickets/comments/${commentId}`, { content: editContent });
            setEditingCommentId(null);
            setEditContent('');
            const res = await api.get(`/tickets/${ticketId}/comments`);
            setComments(res.data);
        } catch (err) {
            alert('Failed to update comment');
        }
    };

    const updateStatus = async (status, extra = {}) => {
        try {
            await api.put(`/tickets/${ticketId}/status`, { status, ...extra });
            fetchTicketDetails();
            onUpdate();
            setIsRejecting(false);
            setIsResolving(false);
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const handleAssign = async (techId) => {
        if (!techId) return;
        updateStatus(ticket.status, { assigneeId: techId });
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm('Are you sure you want to delete this comment?')) return;
        try {
            await api.delete(`/tickets/comments/${commentId}`);
            setComments(comments.filter(c => c.id !== commentId));
        } catch (err) {
            alert('Failed to delete comment');
        }
    };

    const handleDeleteTicket = async () => {
        if (!window.confirm('Are you sure you want to permanently delete this incident report?')) return;
        try {
            await api.delete(`/tickets/${ticketId}`);
            onUpdate();
            onClose();
        } catch (err) {
            alert('Failed to delete ticket');
        }
    };

    if (loading) return (
        <div className="modal-overlay">
            <div className="modal-content p-6">
                <div className="skeleton skeleton-text w-1/2 mb-4"></div>
                <div className="skeleton skeleton-card"></div>
            </div>
        </div>
    );

    if (!ticket) return null;

    const isAdmin = user?.role?.toUpperCase() === 'ADMIN';
    const isTech = user?.role?.toUpperCase() === 'TECHNICIAN';
    const isAdminOrTech = isAdmin || isTech;

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

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content fade-in" onClick={e => e.stopPropagation()} style={{ maxWidth: '900px' }}>
                <div style={{ padding: '2rem' }}>
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className={`badge ${getStatusBadgeClass(ticket.status)}`}>{ticket.status}</span>
                                <span className={`badge ${getPriorityBadgeClass(ticket.priority)}`}>{ticket.priority}</span>
                                <span className="text-secondary text-sm">#{ticket.id}</span>
                            </div>
                            <h2 style={{ fontSize: '1.5rem' }}>{ticket.category} Issue</h2>
                            <p className="text-sm text-secondary">Created on {new Date(ticket.createdAt).toLocaleString()} by {ticket.creator?.name}</p>
                        </div>
                        <div className="flex gap-2">
                            {(isAdmin || ticket.creator?.id === user.id) && (
                                <button className="p-btn p-btn-secondary" 
                                        style={{ padding: '0', width: '32px', height: '32px', color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.2)' }} 
                                        onClick={handleDeleteTicket} 
                                        title="Delete Ticket">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/></svg>
                                </button>
                            )}
                            <button className="p-btn p-btn-secondary" style={{ padding: '0', width: '32px', height: '32px' }} onClick={onClose}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-8">
                        <div className="p-card" style={{ padding: '1.25rem', backgroundColor: 'var(--surface-color-light)', border: 'none' }}>
                            <h4 className="text-xs font-bold text-secondary uppercase mb-3">Ticket Information</h4>
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-secondary">Location:</span>
                                    <span className="font-bold">{ticket.location || 'Not specified'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-secondary">Resource:</span>
                                    <span className="font-bold">{ticket.resource?.name || 'General'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-secondary">Contact Name:</span>
                                    <span className="font-bold">{ticket.contactName || ticket.creator?.name}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-secondary">Contact via:</span>
                                    <span className="font-bold">{ticket.preferredContactMethod || 'Email'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-secondary">Direct Contact:</span>
                                    <span className="font-bold">{ticket.contactDetails}</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-card" style={{ padding: '1.25rem', backgroundColor: 'var(--surface-color-light)', border: 'none' }}>
                            <h4 className="text-xs font-bold text-secondary uppercase mb-3">Assignment & Status</h4>
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-secondary">Assigned To:</span>
                                    <span className="font-bold">{ticket.assignee?.name || 'Unassigned'}</span>
                                </div>
                                {isAdmin && ticket.status !== 'CLOSED' && (
                                    <select className="p-input mt-2" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} 
                                            onChange={(e) => handleAssign(e.target.value)} value={ticket.assignee?.id || ''}>
                                        <option value="">Assign Technician...</option>
                                        {technicians.map(tech => (
                                            <option key={tech.id} value={tech.id}>{tech.name}</option>
                                        ))}
                                    </select>
                                )}
                                {isAdminOrTech && ticket.status !== 'CLOSED' && ticket.status !== 'REJECTED' && (
                                    <div className="flex gap-2 mt-2">
                                        {ticket.status === 'OPEN' && (
                                            <button className="p-btn p-btn-primary w-full" style={{ padding: '0.5rem', fontSize: '0.8rem' }} 
                                                    onClick={() => updateStatus('IN_PROGRESS')}>Start Work</button>
                                        )}
                                        {ticket.status === 'IN_PROGRESS' && (
                                            <button className="p-btn p-btn-primary w-full" style={{ padding: '0.5rem', fontSize: '0.8rem', backgroundColor: 'var(--sd-resolved)' }} 
                                                    onClick={() => setIsResolving(true)}>Resolve</button>
                                        )}
                                        {ticket.status !== 'RESOLVED' && isAdmin && (
                                            <button className="p-btn p-btn-secondary w-full" style={{ padding: '0.5rem', fontSize: '0.8rem', color: 'var(--danger)' }} 
                                                    onClick={() => setIsRejecting(true)}>Reject</button>
                                        )}
                                        {ticket.status === 'RESOLVED' && isAdmin && (
                                            <button className="p-btn p-btn-secondary w-full" style={{ padding: '0.5rem', fontSize: '0.8rem' }} 
                                                    onClick={() => {
                                                        if(window.confirm('Are you sure you want to officially close this ticket?')) {
                                                            updateStatus('CLOSED');
                                                        }
                                                    }}>Close Ticket</button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h4 className="text-xs font-bold text-secondary uppercase mb-3">Description</h4>
                        <div className="p-card" style={{ whiteSpace: 'pre-wrap' }}>{ticket.description}</div>
                    </div>

                    {ticket.rejectReason && (
                        <div className="mb-8 p-4" style={{ backgroundColor: 'rgba(239, 68, 68, 0.05)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                            <h4 className="text-xs font-bold text-secondary uppercase mb-1" style={{ color: 'var(--danger)' }}>Rejection Reason</h4>
                            <p className="text-sm">{ticket.rejectReason}</p>
                        </div>
                    )}

                    {ticket.resolutionNotes && (
                        <div className="mb-8 p-4" style={{ backgroundColor: 'rgba(16, 185, 129, 0.05)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                            <h4 className="text-xs font-bold text-secondary uppercase mb-1" style={{ color: 'var(--sd-resolved)' }}>Resolution Notes</h4>
                            <p className="text-sm">{ticket.resolutionNotes}</p>
                        </div>
                    )}

                    {(ticket.attachment1 || ticket.attachment2 || ticket.attachment3) && (
                        <div className="mb-8">
                            <h4 className="text-xs font-bold text-secondary uppercase mb-3">Attachments</h4>
                            <div className="flex gap-4">
                                {[ticket.attachment1, ticket.attachment2, ticket.attachment3].filter(Boolean).map((att, idx) => (
                                    <div key={idx} className="p-card" style={{ padding: '0.5rem', cursor: 'pointer', width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
                                         onClick={() => setSelectedImage(att)}>
                                        {att.startsWith('data:image') ? (
                                            <img src={att} alt={`Attachment ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                                        ) : (
                                            <div className="text-center">
                                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                                                <p className="text-xs truncate" style={{ maxWidth: '100px' }}>{att}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {(() => {
                        const isRejected = ticket.status === 'REJECTED';
                        const steps = isRejected 
                            ? [{ value: 'OPEN', label: 'Open' }, { value: 'REJECTED', label: 'Rejected' }]
                            : [
                                { value: 'OPEN', label: 'Open' },
                                { value: 'IN_PROGRESS', label: 'In Progress' },
                                { value: 'RESOLVED', label: 'Resolved' },
                                { value: 'CLOSED', label: 'Closed' }
                              ];

                        const currentIdx = steps.findIndex(s => s.value === ticket.status);

                        return (
                            <div className="mb-8 p-card">
                                <h4 className="text-xs font-bold text-secondary uppercase mb-6">Status Lifecycle</h4>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', padding: '0 1rem' }}>
                                    <div style={{ position: 'absolute', top: '16px', left: '10%', right: '10%', height: '3px', backgroundColor: 'var(--border-color)', zIndex: 1 }}></div>
                                    
                                    {steps.map((step, index) => {
                                        const isActive = ticket.status === step.value;
                                        const isPast = currentIdx > index;
                                        let color = 'var(--text-secondary)';
                                        
                                        if (isActive) {
                                            if (step.value === 'OPEN') color = 'var(--sd-open)';
                                            if (step.value === 'IN_PROGRESS') color = 'var(--sd-progress)';
                                            if (step.value === 'RESOLVED') color = 'var(--sd-resolved)';
                                            if (step.value === 'CLOSED') color = 'var(--sd-closed)';
                                            if (step.value === 'REJECTED') color = 'var(--danger)';
                                        } else if (isPast) {
                                            color = 'var(--primary)'; // Passed steps are green
                                        }

                                        return (
                                            <div key={step.value} 
                                                 style={{ 
                                                     display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 2,
                                                     cursor: isAdmin ? 'pointer' : 'default',
                                                     opacity: (isActive || isPast) ? 1 : 0.5,
                                                     width: '80px'
                                                 }}
                                                 onClick={() => {
                                                     if (isAdmin && ticket.status !== step.value) {
                                                         if(window.confirm(`Are you sure you want to change the status to ${step.label}?`)) {
                                                             updateStatus(step.value);
                                                         }
                                                     }
                                                 }}>
                                                <div style={{ 
                                                    width: '36px', height: '36px', borderRadius: '50%', 
                                                    backgroundColor: isActive ? color : (isPast ? color : 'var(--surface-color)'), 
                                                    border: `3px solid ${isActive ? color : (isPast ? color : 'var(--border-color)')}`,
                                                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                                                    color: (isActive || isPast) ? 'white' : 'var(--text-secondary)',
                                                    marginBottom: '0.5rem',
                                                    transition: 'all 0.3s',
                                                    boxShadow: isActive ? `0 0 0 4px ${color}33` : 'none'
                                                }}>
                                                    {isPast ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg> : (index + 1)}
                                                </div>
                                                <span className="text-xs font-bold text-center" style={{ color: isActive ? color : 'var(--text-primary)' }}>{step.label}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                                {isAdmin && <p className="text-xs text-secondary mt-6 text-center" style={{ fontStyle: 'italic' }}>Click on a step to change the ticket status directly.</p>}
                            </div>
                        );
                    })()}

                    <div className="mt-12">
                        <h4 className="text-xs font-bold text-secondary uppercase mb-6">Activity & Comments</h4>
                        <div className="mb-6" style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                            {comments.length === 0 ? (
                                <div className="text-center py-8 text-secondary">
                                    <p>No comments yet. Start the conversation!</p>
                                </div>
                            ) : (
                                comments.map(comment => {
                                    const isMe = comment.author?.email === user.email;
                                    const roleClass = (comment.author?.role || 'USER').toLowerCase();
                                    return (
                                        <div key={comment.id} className={`comment-bubble ${isMe ? 'me' : 'other'} role-${roleClass}`}>
                                            <div className="comment-meta">
                                                <span className="font-bold">{comment.author?.name}</span>
                                                {comment.author?.role === 'TECHNICIAN' && <span className="badge" style={{fontSize: '0.6rem', padding: '0.1rem 0.3rem', backgroundColor: 'var(--sd-medium)', color: 'white', borderColor: 'var(--sd-medium)'}}>Tech</span>}
                                                {comment.author?.role === 'ADMIN' && <span className="badge" style={{fontSize: '0.6rem', padding: '0.1rem 0.3rem', backgroundColor: 'var(--danger)', color: 'white', borderColor: 'var(--danger)'}}>Admin</span>}
                                                <span>•</span>
                                                <span>{new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                            {editingCommentId === comment.id ? (
                                                <div className="mt-2">
                                                    <input type="text" className="p-input text-sm p-1 w-full mb-1" value={editContent} onChange={(e) => setEditContent(e.target.value)} />
                                                    <div className="flex gap-2">
                                                        <button className="text-xs text-primary font-bold" onClick={() => handleEditComment(comment.id)}>Save</button>
                                                        <button className="text-xs text-secondary font-bold" onClick={() => setEditingCommentId(null)}>Cancel</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-sm">{comment.content}</p>
                                            )}
                                            {(comment.author?.email === user.email || isAdmin) && (
                                                <div className="comment-actions">
                                                    {comment.author?.email === user.email && (
                                                        <button className="text-xs hover:underline opacity-70" style={{marginRight: '0.5rem'}} onClick={() => { setEditingCommentId(comment.id); setEditContent(comment.content); }}>Edit</button>
                                                    )}
                                                    <button className="text-xs hover:underline opacity-70" onClick={() => handleDeleteComment(comment.id)}>Delete</button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                        <form onSubmit={handleComment} className="flex gap-3">
                            <input type="text" className="p-input" placeholder="Type a message..." value={newComment} onChange={e => setNewComment(e.target.value)} />
                            <button type="submit" className="p-btn p-btn-primary">Send</button>
                        </form>
                    </div>
                </div>
            </div>

            {isRejecting && (
                <div className="modal-overlay" style={{ zIndex: 1100 }}>
                    <div className="p-card fade-in" onClick={e => e.stopPropagation()} style={{ width: '400px' }}>
                        <h3 className="mb-4">Reject Ticket</h3>
                        <p className="text-sm text-secondary mb-4">Please provide a reason for rejecting this ticket.</p>
                        <textarea className="p-input mb-4" rows="3" placeholder="Reason for rejection..." value={rejectReason} onChange={e => setRejectReason(e.target.value)}></textarea>
                        <div className="flex gap-3">
                            <button className="p-btn p-btn-secondary w-full" onClick={() => setIsRejecting(false)}>Cancel</button>
                            <button className="p-btn p-btn-primary w-full" style={{ backgroundColor: 'var(--danger)' }} 
                                    onClick={() => updateStatus('REJECTED', { rejectReason })}>Reject Ticket</button>
                        </div>
                    </div>
                </div>
            )}

            {isResolving && (
                <div className="modal-overlay" style={{ zIndex: 1100 }}>
                    <div className="p-card fade-in" onClick={e => e.stopPropagation()} style={{ width: '400px' }}>
                        <h3 className="mb-4">Resolve Ticket</h3>
                        <p className="text-sm text-secondary mb-4">Add any final notes about how the issue was resolved.</p>
                        <textarea className="p-input mb-4" rows="3" placeholder="Resolution notes..." value={resolutionNotes} onChange={e => setResolutionNotes(e.target.value)}></textarea>
                        <div className="flex gap-3">
                            <button className="p-btn p-btn-secondary w-full" onClick={() => setIsResolving(false)}>Cancel</button>
                            <button className="p-btn p-btn-primary w-full" style={{ backgroundColor: 'var(--sd-resolved)' }} 
                                    disabled={!resolutionNotes.trim()}
                                    onClick={() => updateStatus('RESOLVED', { resolutionNotes })}>Mark Resolved</button>
                        </div>
                    </div>
                </div>
            )}

            {selectedImage && (
                <div className="modal-overlay" style={{ zIndex: 1200, backdropFilter: 'blur(8px)' }} onClick={() => setSelectedImage(null)}>
                    <div style={{ maxWidth: '90%', maxHeight: '90%', position: 'relative' }} onClick={e => e.stopPropagation()}>
                        <div className="p-card p-2" style={{ backgroundColor: 'white' }}>
                            <div className="w-full flex justify-end mb-2">
                                <button className="p-btn p-btn-secondary" style={{ padding: '0', width: '32px', height: '32px' }} onClick={() => setSelectedImage(null)}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                                </button>
                            </div>
                            <div className="flex items-center justify-center" style={{ minWidth: '300px', minHeight: '300px' }}>
                                 {selectedImage.startsWith('data:image') ? (
                                     <img src={selectedImage} alt="Full Preview" style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)' }} />
                                 ) : (
                                     <div className="text-center p-12">
                                         <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--primary)' }}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                                         <p className="mt-4 font-bold">{selectedImage}</p>
                                     </div>
                                 )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TicketDetails;
