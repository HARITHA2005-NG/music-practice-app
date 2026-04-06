import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './App.css'; 

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/login', formData);
            localStorage.setItem('username', res.data.user.username);
            setMessage(`Success! Welcome back, ${res.data.user.username}`);
            setTimeout(() => navigate('/select-level'), 1000);
        } catch (err) {
            setMessage(err.response?.data?.error || "Login failed.");
        }
    };

    return (
        /* The wrapper is essential for centering the entire block */
        <div className="modern-login-wrapper">
            <div className="modern-login-container page-fade">
                <header className="login-branding">
                    <div className="brand-icon">🎼</div>
                    <h1>Welcome back</h1>
                </header>

                <form onSubmit={handleSubmit} className="modern-form">
                    <div className="modern-field">
                        <label>Account Identifier</label>
                        <input 
                            type="text" 
                            placeholder="Username"
                            value={formData.username} 
                            onChange={e => setFormData({...formData, username: e.target.value})} 
                            required 
                        />
                    </div>

                    <div className="modern-field">
                        <label>Security Key</label>
                        <input 
                            type="password" 
                            placeholder="Password"
                            value={formData.password} 
                            onChange={e => setFormData({...formData, password: e.target.value})} 
                            required 
                        />
                    </div>

                    <button type="submit" className="modern-submit-btn">
                        Continue
                    </button>
                </form>

                {message && (
                    <div className={`modern-status ${message.includes('Success') ? 'success' : 'error'}`}>
                        {message}
                    </div>
                )}

                <footer className="modern-footer">
                    <p>Don't have an account?</p>
                    <Link to="/register" className="signup-link">Sign up</Link>
                </footer>
            </div>
        </div>
    );
};

export default Login;