import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Calendar, MessageSquare, Bell, Lock } from 'lucide-react';

const Login = () => {
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState('admin@smartcampus.edu');
    const [password, setPassword] = useState('admin123');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            alert('Login failed');
        }
    };

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
            <div className="login-left-panel" style={{ 
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
                {/* Logo Section */}
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

                {/* Main Content */}
                <div style={{ maxWidth: '600px', zIndex: 10 }}>
                    <p style={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.1em', color: '#4ade80', marginBottom: '1.5rem' }}>
                        Unified Campus Experience
                    </p>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: '800', lineHeight: 1.1, marginBottom: '2rem', letterSpacing: '-0.02em', color: 'white' }}>
                        Streamline your campus experience <br />
                        <span style={{ color: 'rgba(255,255,255,0.7)' }}>with green technology.</span>
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.7)', marginBottom: '4rem', lineHeight: '1.6' }}>
                        Manage bookings, support requests, and campus services through one secure and sustainable platform.
                    </p>

                    {/* Feature Cards */}
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

                {/* Background Decor */}
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
                    © 2026 Smart Campus Hub. Sustainable Education Platform.
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="login-right-panel" style={{ 
                flex: '0.8', 
                height: '100%',
                display: 'flex', 
                flexDirection: 'column', 
                padding: '2rem',
                backgroundColor: '#fff',
                overflowY: 'auto'
            }}>
                <div style={{ maxWidth: '440px', margin: 'auto', width: '100%', padding: '2rem 0' }}>
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
                            Welcome Back
                        </p>
                        <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.75rem' }}>
                            Sign in to Smart Campus
                        </h2>
                        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
                            Access your campus services securely in one place.
                        </p>
                    </div>

                    <div style={{ 
                        backgroundColor: '#fff', 
                        padding: '2.5rem', 
                        borderRadius: '24px', 
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)',
                        border: '1px solid #f1f5f9'
                    }}>
                        <div style={{ marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <div>
                                    <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: '700', color: '#0f172a' }}>Institutional sign-in</h4>
                                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>Use your university Google account</p>
                                </div>
                                <Lock size={16} color="#94a3b8" />
                            </div>
                            <a 
                                href="http://localhost:8082/oauth2/authorization/google" 
                                style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    backgroundColor: '#fff', 
                                    color: '#1f2937', 
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    border: '1px solid #e2e8f0',
                                    textDecoration: 'none',
                                    fontWeight: '600',
                                    fontSize: '0.875rem',
                                    transition: 'all 0.2s ease',
                                    gap: '0.75rem'
                                }}
                            >
                                <img src="https://developers.google.com/identity/images/g-logo.png" alt="G" style={{ width: '14px' }} />
                                Continue with Google
                            </a>
                        </div>

                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '1rem', 
                            marginBottom: '2rem',
                            color: '#e2e8f0',
                            fontSize: '0.7rem',
                            fontWeight: '700'
                        }}>
                            <div style={{ flex: 1, height: '1px', backgroundColor: '#f1f5f9' }}></div>
                            OR
                            <div style={{ flex: 1, height: '1px', backgroundColor: '#f1f5f9' }}></div>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>
                                    Email Address
                                </label>
                                <input 
                                    type="email" 
                                    placeholder="name@university.edu"
                                    value={email} 
                                    onChange={e => setEmail(e.target.value)} 
                                    required 
                                    style={{ 
                                        width: '100%', padding: '0.875rem 1rem', borderRadius: '10px',
                                        border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '0.95rem', outline: 'none'
                                    }}
                                    onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                                />
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#475569' }}>Password</label>
                                    <a href="#" style={{ fontSize: '0.8125rem', color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>Forgot password?</a>
                                </div>
                                <input 
                                    type="password" 
                                    placeholder="••••••••"
                                    value={password} 
                                    onChange={e => setPassword(e.target.value)} 
                                    required 
                                    style={{ 
                                        width: '100%', padding: '0.875rem 1rem', borderRadius: '10px',
                                        border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '0.95rem', outline: 'none'
                                    }}
                                    onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                                />
                            </div>
                            
                            <button 
                                type="submit" 
                                style={{ 
                                    width: '100%',
                                    backgroundColor: '#166534', 
                                    color: 'white', 
                                    padding: '1rem',
                                    borderRadius: '10px',
                                    border: 'none',
                                    fontWeight: '700',
                                    fontSize: '1rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                    marginBottom: '1.5rem'
                                }}
                                onMouseOver={e => e.currentTarget.style.backgroundColor = '#14532D'}
                                onMouseOut={e => e.currentTarget.style.backgroundColor = '#166534'}
                            >
                                Sign In to Portal
                            </button>

                            <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#94a3b8', lineHeight: '1.5', margin: 0 }}>
                                Secure single sign-on with role-based access for students, staff, and administrators.
                            </p>
                        </form>
                    </div>

                    <div style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.875rem', color: '#64748b' }}>
                        Need assistance? <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: '700', textDecoration: 'none' }}>Create an account</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
