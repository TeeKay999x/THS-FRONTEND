import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Groceries');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const API_BASE_URL = "https://ths-egaz.onrender.com/api/products"; 
  const ADMIN_BASE_URL = "https://ths-egaz.onrender.com/api/admin";

  // 🔄 Fetch all products on layout mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // withCredentials lets the browser send the session cookie back to the backend
      const response = await axios.get(API_BASE_URL, { withCredentials: true });
      setProducts(response.data || []);
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  // ➕ Handle adding a new product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post(
        API_BASE_URL, 
        { name, price: Number(price), category }, 
        { withCredentials: true }
      );

      if (response.data) {
        setMessage('✅ Product added to inventory successfully!');
        setName('');
        setPrice('');
        fetchProducts(); // Refresh layout list
      }
    } catch (error) {
      setMessage(`❌ Failed to add product: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Toggle item status/availability
  const handleToggleProduct = async (productId) => {
    try {
      await axios.patch(`${API_BASE_URL}/${productId}/toggle`, {}, { withCredentials: true });
      fetchProducts(); // Refresh layout state
    } catch (error) {
      alert("Error toggling product status");
    }
  };

  // 🚪 Clear session status on logout
  const handleLogout = async () => {
    try {
      // Hit backend logout endpoint to clear HTTP cookie array strings cleanly
      await axios.post(`${ADMIN_BASE_URL}/logout`, {}, { withCredentials: true });
    } catch (err) {
      console.error("Backend cookie clearing failed:", err);
    } finally {
      // Always wipe client storage state flag and bounce back to entry gate
      localStorage.removeItem('isAdminLoggedIn');
      window.location.href = '/admin/auth';
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      
      {/* Header Panel Layout */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #ddd', paddingBottom: '20px', marginBottom: '30px' }}>
        <div>
          <h1 style={{ margin: 0, color: '#333' }}>🏪 Vendura Market</h1>
          <p style={{ margin: '5px 0 0 0', color: '#666' }}>Management Studio Workspace</p>
        </div>
        <button onClick={handleLogout} style={{ padding: '10px 20px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
          Sign Out of Session
        </button>
      </div>

      {message && (
        <div style={{ padding: '12px', borderRadius: '5px', marginBottom: '20px', fontWeight: 'bold', background: message.includes('✅') ? '#d4edda' : '#f8d7da', color: message.includes('✅') ? '#155724' : '#721c24' }}>
          {message}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
        
        {/* Left Hand: Stock Input Workspace Control Form */}
        <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', border: '1px solid #eee', height: 'fit-content' }}>
          <h3 style={{ marginTop: 0, marginBottom: '15px' }}>📦 Add New Stock</h3>
          <form onSubmit={handleAddProduct}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '14px' }}>Product Name:</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Fresh Tomatoes" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '14px' }}>Price (₦):</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required placeholder="e.g. 1500" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '14px' }}>Category Mapping:</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}>
                <option value="Groceries">Groceries</option>
                <option value="Cooking Gas">Cooking Gas</option>
                <option value="Drinks">Drinks</option>
                <option value="Household">Household</option>
              </select>
            </div>

            <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Saving Item...' : 'Commit Item to Database'}
            </button>
          </form>
        </div>

        {/* Right Hand: Active Store Grid Compilation View */}
        <div>
          <h3 style={{ marginTop: 0, marginBottom: '15px' }}>📋 Active Catalog Items ({products.length})</h3>
          {products.length === 0 ? (
            <p style={{ color: '#888', fontStyle: 'italic' }}>No inventory items found matching database fields.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {products.map((product) => (
                <div key={product._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 15px', background: '#fff', border: '1px solid #ddd', borderRadius: '6px' }}>
                  <div>
                    <strong style={{ display: 'block', fontSize: '16px' }}>{product.name}</strong>
                    <span style={{ fontSize: '14px', color: '#666' }}>💰 ₦{product.price} | 🏷️ {product.category}</span>
                  </div>
                  <button 
                    onClick={() => handleToggleProduct(product._id)} 
                    style={{ 
                      padding: '6px 12px', 
                      borderRadius: '4px', 
                      border: 'none', 
                      fontWeight: 'bold', 
                      cursor: 'pointer', 
                      background: product.isAvailable ? '#e2f0d9' : '#fce4d6', 
                      color: product.isAvailable ? '#385723' : '#c65911' 
                    }}
                  >
                    {product.isAvailable ? '● Available' : '○ Out of Stock'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;