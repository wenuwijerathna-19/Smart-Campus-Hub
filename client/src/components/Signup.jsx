import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, Briefcase, Wrench, Calendar, MessageSquare, Bell, ArrowRight } from 'lucide-react';
import api from '../services/api';

const Signup = () => {
    const [formData, setFormData] = useState({ 
        name: '', 
        email: '', 
        password: '', 
        confirmPassword: '',
        role: 'USER' 
    });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        try {
            await api.post('/auth/signup', {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.role
            });
            alert('Account created! Sign in to continue.');
            navigate('/login');
        } catch (err) {
            alert('Signup failed');
        }
    };

    const ROLE_TYPES = [
        { id: 'STUDENT', label: 'Student', icon: <GraduationCap size={18} /> },
        { id: 'STAFF', label: 'Staff', icon: <Briefcase size={18} /> },
        { id: 'TECHNICIAN', label: 'Technician', icon: <Wrench size={18} /> },
    ];

    return (
        <div style={{ 
            display: 'flex', 
            height: '100vh', 
            width: '100vw',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 1000,
            backgroundColor: '#f8fafc',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            overflow: 'hidden'
        }}>
            {/* Left Side - Hero Section */}
            <div className="signup-left-panel" style={{ 
                flex: '1.2', 
                height: '100%', 
                background: 'linear-gradient(135deg, #166534 0%, #064e3b 100%)',
                display: 'flex',
                flexDirection: 'column',
                padding: '4rem',
                color: 'white',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '4rem', zIndex: 10 }}>
                    <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        backgroundColor: '#fff', 
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}>
                        <span style={{ fontSize: '1.5rem' }}>🎓</span>
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0, letterSpacing: '-0.02em', color: 'white' }}>Smart Campus Hub</h2>
                        <p style={{ fontSize: '0.75rem', opacity: 0.8, margin: 0, color: 'white' }}>Campus services and support platform</p>
                    </div>
                </div>

                <div style={{ maxWidth: '600px', zIndex: 10 }}>
                    <p style={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.1em', color: '#4ade80', marginBottom: '1.5rem' }}>
                        Join Our Community
                    </p>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: '800', lineHeight: 1.1, marginBottom: '2rem', letterSpacing: '-0.02em', color: 'white' }}>
                        Start your smart campus <br />
                        <span style={{ color: 'rgba(255,255,255,0.7)' }}>journey today.</span>
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.7)', marginBottom: '4rem', lineHeight: '1.6' }}>
                        Create an account to access resource bookings, ticketing services, and real-time notifications.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                        {[
                            { icon: <Calendar size={20} />, title: "Resource booking" },
                            { icon: <MessageSquare size={20} />, title: "Support ticket tracking" },
                            { icon: <Bell size={20} />, title: "Smart notifications" }
                        ].map((item, idx) => (
                            <div key={idx} style={{ 
                                backgroundColor: 'rgba(255,255,255,0.05)', 
                                padding: '1.5rem', 
                                borderRadius: '12px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                backdropFilter: 'blur(8px)'
                            }}>
                                <div style={{ color: '#4ade80', marginBottom: '1rem' }}>{item.icon}</div>
                                <h3 style={{ fontSize: '0.875rem', fontWeight: '600', margin: 0, color: 'white' }}>{item.title}</h3>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{
                    position: 'absolute',
                    bottom: '-20%',
                    right: '-10%',
                    width: '600px',
                    height: '600px',
                    background: 'radial-gradient(circle, rgba(34, 197, 94, 0.1) 0%, transparent 70%)',
                    borderRadius: '50%',
                    zIndex: 1
                }}></div>

                <div style={{ position: 'absolute', bottom: '2rem', left: '4rem', fontSize: '0.75rem', opacity: 0.5 }}>
                    © 2026 Smart Campus Hub. Efficient. Sustainable. Integrated.
                </div>
            </div>

            {/* Right Side - Signup Form */}
            <div className="signup-right-panel" style={{ 
                flex: '0.8', 
                height: '100%',
                display: 'flex', 
                flexDirection: 'column', 
                padding: '2rem',
                backgroundColor: '#fff',
                overflowY: 'auto'
            }}>
                <div style={{ maxWidth: '440px', margin: 'auto', width: '100%', padding: '2rem 0' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
                            Get Started
                        </p>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>
                            Create your Hub account
                        </h2>
                        <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
                            Access your campus services securely in one place.
                        </p>
                    </div>

                    <div style={{ 
                        backgroundColor: '#fff', 
                        padding: '2rem', 
                        borderRadius: '24px', 
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)',
                        border: '1px solid #f1f5f9'
                    }}>
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '600', color: '#475569', marginBottom: '0.75rem' }}>
                                    Select Account Type
                                </label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                                    {ROLE_TYPES.map(role => (
                                        <div 
                                            key={role.id}
                                            onClick={() => setFormData({...formData, role: role.id})}
                                            style={{
                                                border: formData.role === role.id ? `2px solid #166534` : '1px solid #e2e8f0',
                                                borderRadius: '10px',
                                                padding: '0.75rem 0.5rem',
                                                textAlign: 'center',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                                backgroundColor: formData.role === role.id ? '#f0fdf4' : '#fff',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                gap: '0.4rem'
                                            }}
                                        >
                                            <div style={{ color: formData.role === role.id ? '#166534' : '#64748b', opacity: formData.role === role.id ? 1 : 0.4 }}>{role.icon}</div>
                                            <span style={{ fontSize: '0.65rem', fontWeight: '700', color: formData.role === role.id ? '#166534' : '#64748b' }}>{role.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div style={{ marginBottom: '1.25rem' }}>
                                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>
                                    Full Name
                                </label>
                                <input 
                                    type="text" 
                                    placeholder="Full Name"
                                    value={formData.name} 
                                    onChange={e => setFormData({...formData, name: e.target.value})} 
                                    required 
                                    style={{ 
                                        width: '100%', padding: '0.8rem 1rem', borderRadius: '10px',
                                        border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '0.9rem', outline: 'none'
                                    }}
                                    onFocus={e => e.target.style.borderColor = '#166534'}
                                />
                            </div>

                            <div style={{ marginBottom: '1.25rem' }}>
                                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>
                                    Email Address
                                </label>
                                <input 
                                    type="email" 
                                    placeholder="name@university.edu"
                                    value={formData.email} 
                                    onChange={e => setFormData({...formData, email: e.target.value})} 
                                    required 
                                    style={{ 
                                        width: '100%', padding: '0.8rem 1rem', borderRadius: '10px',
                                        border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '0.9rem', outline: 'none'
                                    }}
                                    onFocus={e => e.target.style.borderColor = '#166534'}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>Password</label>
                                    <input 
                                        type="password" 
                                        placeholder="••••••••"
                                        value={formData.password} 
                                        onChange={e => setFormData({...formData, password: e.target.value})} 
                                        required 
                                        style={{ 
                                            width: '100%', padding: '0.8rem 1rem', borderRadius: '10px',
                                            border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '0.9rem', outline: 'none'
                                        }}
                                        onFocus={e => e.target.style.borderColor = '#166534'}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>Confirm</label>
                                    <input 
                                        type="password" 
                                        placeholder="••••••••"
                                        value={formData.confirmPassword} 
                                        onChange={e => setFormData({...formData, confirmPassword: e.target.value})} 
                                        required 
                                        style={{ 
                                            width: '100%', padding: '0.8rem 1rem', borderRadius: '10px',
                                            border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '0.9rem', outline: 'none'
                                        }}
                                        onFocus={e => e.target.style.borderColor = '#166534'}
                                    />
                                </div>
                            </div>
                            
                            <button 
                                type="submit" 
                                style={{ 
                                    width: '100%', backgroundColor: '#166534', color: 'white', padding: '1rem',
                                    borderRadius: '10px', border: 'none', fontWeight: '700', fontSize: '1rem',
                                    cursor: 'pointer', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                    marginBottom: '1.5rem'
                                }}
                                onMouseOver={e => e.currentTarget.style.backgroundColor = '#14532D'}
                                onMouseOut={e => e.currentTarget.style.backgroundColor = '#166534'}
                            >
                                Create Hub Account <ArrowRight size={18} />
                            </button>

                            <div style={{ 
                                display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem',
                                color: '#e2e8f0', fontSize: '0.7rem', fontWeight: '700'
                            }}>
                                <div style={{ flex: 1, height: '1px', backgroundColor: '#f1f5f9' }}></div>
                                OR
                                <div style={{ flex: 1, height: '1px', backgroundColor: '#f1f5f9' }}></div>
                            </div>

                            <a href="http://localhost:8082/oauth2/authorization/google" style={{ 
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                                backgroundColor: '#fff', color: '#475569', padding: '0.75rem', borderRadius: '8px',
                                border: '1px solid #e2e8f0', textDecoration: 'none', fontSize: '0.875rem', fontWeight: '600'
                            }}>
                                <img src="https://developers.google.com/identity/images/g-logo.png" alt="G" style={{ width: '16px' }} />
                                Sign in with Google
                            </a>
                        </form>
                    </div>

                    <div style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.875rem', color: '#64748b' }}>
                        Already have an account? <Link to="/login" style={{ color: '#166534', fontWeight: '700', textDecoration: 'none' }}>Sign in here</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
