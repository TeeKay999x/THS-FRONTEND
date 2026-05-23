import React, { useState } from 'react';
import axios from 'axios';

const AdminStocker = () => {
  const [formData, setFormData] = useState({
    itemName: '',
    quantity: '',
    totalPrice: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Track field inputs dynamically
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // 🌐 Points straight to your live production Render API backend URL
      const API_URL = "https://ths-egaz.onrender.com/api/products"; 
      
      // 🔑 MUST exactly match the value of ADMIN_SECRET_KEY inside your Render dashboard settings
      const secretProductionKey = "ths_secret_2026"; 

      const response = await axios.post(API_URL, 
        {
          itemName: formData.itemName,
          quantity: Number(formData.quantity),
          totalPrice: Number(formData.totalPrice)
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-admin-key': secretProductionKey // Hands verification cleanly to the server
          }
        }
      );

      if (response.data.success) {
        setMessage(`✅ Successfully uploaded: ${formData.itemName}`);
        setFormData({ itemName: '', quantity: '', totalPrice: '' }); // Clear input values
      }
    } catch (error) {
      setMessage(`❌ Access Blocked: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: '450px', 
      margin: '60px auto', 
      padding: '30px', 
      background: '#fff', 
      borderRadius: '10px', 
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '20px' }}>🛒 THS Stocking Dashboard</h2>
      
      {message && (
        <p style={{ 
          padding: '12px', 
          borderRadius: '5px', 
          textAlign: 'center', 
          fontWeight: 'bold',
          background: message.includes('✅') ? '#d4edda' : '#f8d7da',
          color: message.includes('✅') ? '#155724' : '#721c24'
        }}>
          {message}
        </p>
      )}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#555' }}>Item Name:</label>
          <input 
            type="text" 
            name="itemName" 
            value={formData.itemName} 
            onChange={handleChange} 
            required 
            placeholder="e.g. Fresh Red Tomatoes"
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#555' }}>Quantity in Stock:</label>
          <input 
            type="number" 
            name="quantity" 
            value={formData.quantity} 
            onChange={handleChange} 
            required 
            placeholder="e.g. 100"
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#555' }}>Price (₦):</label>
          <input 
            type="number" 
            name="totalPrice" 
            value={formData.totalPrice} 
            onChange={handleChange} 
            required 
            placeholder="e.g. 1500"
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          style={{ 
            width: '100%', 
            padding: '12px', 
            background: '#28a745', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '5px', 
            fontSize: '16px', 
            fontWeight: 'bold', 
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'Uploading Stock...' : 'Upload Product to Database'}
        </button>
      </form>
    </div>
  );
};

export default AdminStocker;