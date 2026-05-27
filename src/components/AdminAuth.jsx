import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const navigate = useNavigate();
  const API_BASE_URL = "https://ths-egaz.onrender.com/api/admin";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const endpoint = isLogin ? `${API_BASE_URL}/login` : `${API_BASE_URL}/signup`;
    const payload = isLogin ? { email, password } : { name, email, password };

    try {
      // 🍪 withCredentials is required so the browser accepts and stores your HTTP cookie token
      const response = await axios.post(endpoint, payload, { withCredentials: true });

      if (isLogin) {
        // Look for the admin object returned by your loginAdmin controller
        if (response.data.admin) {
          localStorage.setItem('isAdminLoggedIn', 'true');
          setMessage('🎉 Welcome back, Boss! Redirecting...');
          setTimeout(() => {
            navigate('/admin/dashboard');
          }, 1500);
        }
      } else {
        if (response.data.success) {
          setMessage('✅ Account created successfully! Switch tabs to login.');
          setIsLogin(true);
          setPassword('');
        }
      }
    } catch (error) {
      setMessage(`❌ ${error.response?.data?.message || 'Authentication failed'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '80px auto', padding: '30px', background: '#fff', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', fontFamily: 'Arial, sans-serif' }}>
      
      {/* Tab Switchers */}
      <div style={{ display: 'flex', marginBottom: '25px', borderBottom: '2px solid #eee' }}>
        <button type="button" onClick={() => { setIsLogin(true); setMessage(''); }} style={{ flex: 1, padding: '10px', border: 'none', background: 'none', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', color: isLogin ? '#28a745' : '#888', borderBottom: isLogin ? '3px solid #28a745' : 'none' }}>
          Sign In
        </button>
        <button type="button" onClick={() => { setIsLogin(false); setMessage(''); }} style={{ flex: 1, padding: '10px', border: 'none', background: 'none', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', color: !isLogin ? '#28a745' : '#888', borderBottom: !isLogin ? '3px solid #28a745' : 'none' }}>
          Register
        </button>
      </div>

      <h3 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>
        {isLogin ? '🔑 Admin Gateway' : '📝 Create Admin Profile'}
      </h3>

      {message && (
        <p style={{ padding: '10px', borderRadius: '5px', fontSize: '14px', textAlign: 'center', fontWeight: 'bold', background: message.includes('✅') || message.includes('🎉') ? '#d4edda' : '#f8d7da', color: message.includes('✅') || message.includes('🎉') ? '#155724' : '#721c24' }}>
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '14px' }}>Full Name:</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Your Name" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
          </div>
        )}

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '14px' }}>Admin Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="boss@venduramarket.com" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '14px' }}>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
        </div>

        <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Processing...' : isLogin ? 'Access Studio Dashboard' : 'Finalize System Registration'}
        </button>
      </form>
    </div>
  );
};

export default AdminAuth;