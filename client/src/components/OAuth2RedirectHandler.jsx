import { useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const OAuth2RedirectHandler = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { setAuthData } = useContext(AuthContext);

    useEffect(() => {
        const getUrlParameter = (name) => {
            name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
            const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
            const results = regex.exec(location.search);
            return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
        };

        const token = getUrlParameter('token');
        const error = getUrlParameter('error');

        if (token) {
            window.localStorage.setItem('token', token);
            
            try {
                // Decode JWT to get user info
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
                const payload = JSON.parse(jsonPayload);
                
                const rawRole = payload.role || 'USER';
                const userData = {
                    id: payload.sub,
                    name: payload.name || payload.email,
                    email: payload.email,
                    role: rawRole.replace('ROLE_', '')
                };
                
                localStorage.setItem('user', JSON.stringify(userData));
                
                // Update AuthContext state
                if (setAuthData) {
                    setAuthData(userData, token);
                }
                
                // Use window.location.href to force a full refresh and ensure context is updated
                window.location.href = '/dashboard';
            } catch (e) {
                console.error("Token decoding failed", e);
                navigate('/login?error=' + encodeURIComponent(e.message));
            }
        } else if (error) {
            navigate('/login?error=' + encodeURIComponent(error));
        } else {
            navigate('/login');
        }
    }, [location, navigate, setAuthData]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-primary)' }}>
            <div style={{ textAlign: 'center' }}>
                <div className="animate-spin" style={{ 
                    width: '50px', 
                    height: '50px', 
                    border: '5px solid var(--border-color)', 
                    borderTop: '5px solid var(--primary)', 
                    borderRadius: '50%',
                    margin: '0 auto 1rem'
                }}></div>
                <h3 style={{ color: 'var(--text-primary)' }}>Authenticating...</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Please wait while we complete your sign-in.</p>
            </div>
        </div>
    );
};

export default OAuth2RedirectHandler;
