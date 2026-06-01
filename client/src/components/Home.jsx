import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    LayoutDashboard, 
    ArrowRight, 
    Zap,
    Search,
    Wrench,
    Calendar
} from 'lucide-react';

const HERO_IMAGES = [
    '/images/h1.png',
    '/images/h2.png',
    '/images/h3.png'
];

const Home = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ backgroundColor: '#000', minHeight: '100vh' }}>
            {/* Hero Section - Full Viewport */}
            <section style={{ 
                position: 'relative', 
                height: '100vh', 
                width: '100%',
                backgroundColor: '#000',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                textAlign: 'center'
            }}>
                {/* Background Image Slider with Dark Overlay */}
                {HERO_IMAGES.map((img, index) => (
                    <div 
                        key={img}
                        style={{
                            position: 'absolute',
                            top: 0, left: 0, right: 0, bottom: 0,
                            backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.8)), url("${img}")`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            opacity: index === currentImageIndex ? 1 : 0,
                            transition: 'opacity 1.5s ease-in-out',
                            zIndex: 1
                        }}
                    />
                ))}

                <div style={{ maxWidth: '900px', zIndex: 2, position: 'relative', padding: '0 1.5rem' }}>
                    <h1 style={{ color: 'white', fontSize: 'clamp(2.5rem, 8vw, 5rem)', marginBottom: '1.2rem', fontWeight: '900', lineHeight: '1.05', letterSpacing: '-0.04em' }}>
                        Find the Perfect <span style={{ color: 'var(--secondary)', textShadow: '0 0 25px rgba(34, 197, 94, 0.4)' }}>Campus Facility</span>
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.95)', fontSize: 'clamp(1rem, 3vw, 1.35rem)', marginBottom: '3.5rem', lineHeight: '1.6', fontWeight: '400', maxWidth: '750px', margin: '0 auto 3.5rem' }}>
                        Access smart lecture halls, technical laboratories, and high-end equipment instantly through our integrated campus hub.
                    </p>

                    {/* Search Bar Implementation */}
                    <div style={{ 
                        width: '100%', 
                        maxWidth: '720px', 
                        position: 'relative',
                        margin: '0 auto 3rem',
                        filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.3))'
                    }}>
                        <input 
                            type="text" 
                            placeholder="What facility or resource are you looking for?" 
                            style={{
                                width: '100%',
                                padding: '1.4rem 4.5rem 1.4rem 2.5rem',
                                borderRadius: '60px',
                                background: 'rgba(255,255,255,0.18)',
                                border: '2px solid var(--secondary)',
                                color: 'white',
                                fontSize: '1.2rem',
                                backdropFilter: 'blur(12px)',
                                outline: 'none',
                                transition: 'all 0.3s ease',
                                boxShadow: 'inset 0 0 20px rgba(255,255,255,0.05)'
                            }}
                        />
                        <div style={{
                            position: 'absolute',
                            right: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            backgroundColor: 'var(--secondary)',
                            width: '52px',
                            height: '52px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            cursor: 'pointer',
                            boxShadow: '0 4px 15px rgba(22, 101, 52, 0.4)'
                        }}>
                            <Search size={26} />
                        </div>
                    </div>

                    {/* Dual Action Buttons */}
                    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <Link to="/dashboard" className="p-btn" style={{ 
                            backgroundColor: 'var(--secondary)', 
                            color: 'white', 
                            padding: '1.1rem 2.8rem', 
                            borderRadius: '50px',
                            fontWeight: '700',
                            fontSize: '1.1rem',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            transition: 'all 0.3s ease'
                        }}>
                            <LayoutDashboard size={20} /> Explore Directory
                        </Link>
                        <Link to="/tickets" className="p-btn" style={{ 
                            backgroundColor: 'rgba(255,255,255,0.12)', 
                            color: 'white', 
                            padding: '1.1rem 2.8rem', 
                            borderRadius: '50px',
                            border: '2px solid white',
                            fontWeight: '700',
                            fontSize: '1.1rem',
                            textDecoration: 'none',
                            backdropFilter: 'blur(8px)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            transition: 'all 0.3s ease'
                        }}>
                            <Wrench size={20} /> Service Desk
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section style={{ 
                margin: '8rem auto', 
                maxWidth: '1200px', 
                padding: '0 1.5rem' 
            }}>
                <div style={{
                    backgroundColor: 'var(--primary)',
                    borderRadius: 'var(--radius-xl)',
                    padding: '5rem 3rem',
                    color: 'white',
                    textAlign: 'center',
                    backgroundImage: 'radial-gradient(circle at top right, rgba(34, 197, 94, 0.15), transparent 50%), radial-gradient(circle at bottom left, rgba(22, 101, 52, 0.1), transparent 40%)',
                    boxShadow: 'var(--shadow-xl)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <h2 style={{ color: 'white', fontSize: '2.8rem', marginBottom: '1.5rem', fontWeight: '800', letterSpacing: '-0.02em' }}>Ready to Start Your Journey?</h2>
                    <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.2rem', marginBottom: '3rem', maxWidth: '650px', margin: '0 auto 3rem', lineHeight: '1.6' }}>
                        Join thousands of students who are building their future with our world-class resources.
                    </p>
                    <Link to="/dashboard" className="p-btn" style={{ 
                        backgroundColor: 'var(--secondary)', 
                        color: 'white', 
                        padding: '1.1rem 3.5rem', 
                        borderRadius: '50px', 
                        textDecoration: 'none', 
                        fontWeight: '700',
                        fontSize: '1.15rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '12px',
                        boxShadow: '0 8px 20px -5px rgba(217,119,6,0.4)',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        GET STARTED NOW <ArrowRight size={20} />
                    </Link>
                </div>
            </section>

            {/* Minimal Footer */}
            <footer style={{ borderTop: '1px solid #eee', padding: '4rem 2rem', backgroundColor: '#f9fafb' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ backgroundColor: 'var(--primary)', borderRadius: '4px', padding: '4px' }}>
                            <Zap size={20} color="white" />
                        </div>
                        <h2 style={{ color: 'var(--primary)', fontSize: '1.15rem', margin: 0, fontWeight: '800' }}>SMART CAMPUS HUB</h2>
                    </div>
                    <div style={{ color: '#999', fontSize: '0.875rem' }}>
                        &copy; {new Date().getFullYear()} Smart Campus Operations Hub. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
