import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './App.css'; 

const Register = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/register', formData);
            setMessage("Registration Successful! Redirecting to login...");
            setFormData({ username: '', password: '' });
            setTimeout(() => {
                navigate('/'); 
            }, 1500);
        } catch (err) {
            setMessage(err.response?.data?.error || "Registration failed");
        }
    };

    return (
        /* The wrapper ensures the content stays dead-center */
        <div className="modern-login-wrapper">
            <div className="modern-login-container page-fade">
                
                <header className="login-branding">
                    {/* Musical brand icon */}
                    <div className="brand-icon">🎼</div>
                    <h1>Sign up to start practicing</h1>
                </header>

                <form onSubmit={handleSubmit} className="modern-form" autoComplete="off">
                    
                    <div className="modern-field">
                        <label>Choose a Username</label>
                        <input 
                            type="text" 
                            placeholder="Username" 
                            value={formData.username} 
                            autoComplete="new-password" 
                            onChange={e => setFormData({...formData, username: e.target.value})} 
                            required 
                        />
                    </div>

                    <div className="modern-field">
                        <label>Create a Password</label>
                        <input 
                            type="password" 
                            placeholder="Password" 
                            value={formData.password} 
                            autoComplete="new-password" 
                            onChange={e => setFormData({...formData, password: e.target.value})} 
                            required 
                        />
                    </div>
                    
                    {/* Rounded high-contrast button */}
                    <button type="submit" className="modern-submit-btn">
                        Register
                    </button>
                </form>

                {message && (
                    <div className={`modern-status ${message.includes('Successful') ? 'success' : 'error'}`}>
                        {message}
                    </div>
                )}

                <footer className="modern-footer">
                    <p>Already have an account?</p>
                    <Link to="/" className="signup-link">Log in here</Link>
                </footer>
            </div>
        </div>
    );
};

export default Register;