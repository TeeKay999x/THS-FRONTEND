import React, { useState } from 'react';
import axios from 'axios';

const AdminStocker = () => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'vegetables', // default matching an enum type
    image: '',
    tier: 'Standard',       // default tier for options
    price: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const API_URL = "https://ths-egaz.onrender.com/api/products"; 
      const secretProductionKey = "ths_scret_2026"; 

      // 📦 Structure the payload to EXACTLY match your Mongoose Schema
      const productPayload = {
        name: formData.name,
        category: formData.category,
        image: formData.image,
        options: [
          {
            tier: formData.tier,
            price: Number(formData.price)
          }
        ],
        isAvailable: true
      };

      const response = await axios.post(API_URL, productPayload, {
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': secretProductionKey
        }
      });

      if (response.data.success) {
        setMessage(`✅ Successfully uploaded: ${formData.name}`);
        setFormData({ name: '', category: 'vegetables', image: '', tier: 'Standard', price: '' }); 
      }
    } catch (error) {
      setMessage(`❌ Upload Failed: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '450px', margin: '40px auto', padding: '30px', background: '#fff', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '20px' }}>🛒 THS Stocking Dashboard</h2>
      
      {message && (
        <p style={{ padding: '12px', borderRadius: '5px', textAlign: 'center', fontWeight: 'bold', background: message.includes('✅') ? '#d4edda' : '#f8d7da', color: message.includes('✅') ? '#155724' : '#721c24' }}>
          {message}
        </p>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* Name Input */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Item Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
        </div>

        {/* Category Selector */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Category:</label>
          <select name="category" value={formData.category} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }}>
            <option value="vegetables">Vegetables</option>
            <option value="gas">Gas</option>
            <option value="tubers">Tubers</option>
            <option value="grains">Grains</option>
            <option value="spices">Spices</option>
          </select>
        </div>

        {/* Image Link Input */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Image URL:</label>
          <input type="text" name="image" value={formData.image} onChange={handleChange} required placeholder="https://example.com/image.png" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
        </div>

        {/* Options / Pricing Tier */}
        <div style={{ padding: '15px', background: '#f9f9f9', borderRadius: '5px', marginBottom: '20px' }}>
          <h4 style={{ margin: '0 0 10px 0' }}>Pricing Options</h4>
          <label style={{ display: 'block', marginBottom: '5px' }}>Tier Name:</label>
          <input type="text" name="tier" value={formData.tier} onChange={handleChange} required placeholder="e.g. Per Bundle, Per Kilo" style={{ width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
          
          <label style={{ display: 'block', marginBottom: '5px' }}>Price (₦):</label>
          <input type="number" name="price" value={formData.price} onChange={handleChange} required placeholder="e.g. 5000" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
        </div>

        <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '16px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Uploading Stock...' : 'Upload Product to Database'}
        </button>
      </form>
    </div>
  );
};

export default AdminStocker;