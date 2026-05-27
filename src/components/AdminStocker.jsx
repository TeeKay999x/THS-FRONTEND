import React, { useState } from 'react';
import axios from 'axios';

const AdminStocker = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('vegetables'); // default matches schema enum
  const [image, setImage] = useState('');
  
  // State for dynamic multiple tiers
  const [options, setOptions] = useState([
    { tier: '', price: '' } // Starts with one empty option row
  ]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Handle typing inside a specific tier or price row
  const handleOptionChange = (index, e) => {
    const updatedOptions = [...options];
    updatedOptions[index][e.target.name] = e.target.value;
    setOptions(updatedOptions);
  };

  // Add a new empty row for another pricing tier
  const addOptionField = () => {
    setOptions([...options, { tier: '', price: '' }]);
  };

  // Remove an option row if you misclick
  const removeOptionField = (index) => {
    if (options.length > 1) {
      const updatedOptions = options.filter((_, i) => i !== index);
      setOptions(updatedOptions);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const API_URL = "https://ths-egaz.onrender.com/api/products"; 
      const secretProductionKey = "ths_secret_2026"; 

      // Format options to ensure prices are explicitly numbers before sending
      const formattedOptions = options.map(opt => ({
        tier: opt.tier,
        price: Number(opt.price)
      }));

      const productPayload = {
        name,
        category,
        image,
        options: formattedOptions,
        isAvailable: true
      };

      const response = await axios.post(API_URL, productPayload, {
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': secretProductionKey
        }
      });

      if (response.data.success) {
        setMessage(`✅ Successfully uploaded: ${name} with ${options.length} pricing tiers!`);
        setName('');
        setCategory('vegetables');
        setImage('');
        setOptions([{ tier: '', price: '' }]); // Reset back to a single row
      }
    } catch (error) {
      setMessage(`❌ Upload Failed: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', padding: '30px', background: '#fff', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '20px' }}>🛒 THS Stocking Dashboard</h2>
      
      {message && (
        <p style={{ padding: '12px', borderRadius: '5px', textAlign: 'center', fontWeight: 'bold', background: message.includes('✅') ? '#d4edda' : '#f8d7da', color: message.includes('✅') ? '#155724' : '#721c24' }}>
          {message}
        </p>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* Item Name */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Item Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Cooking Gas, Fresh Ugwu" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
        </div>

        {/* Category Setup */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Category:</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }}>
            <option value="vegetables">Vegetables</option>
            <option value="gas">Gas</option>
          </select>
        </div>

        {/* Image Link */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Image URL:</label>
          <input type="text" value={image} onChange={(e) => setImage(e.target.value)} required placeholder="https://example.com/image.png" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
        </div>

        {/* Dynamic Quantity Tiering & Pricing Container */}
        <div style={{ padding: '15px', background: '#f9f9f9', borderRadius: '5px', marginBottom: '20px', border: '1px dashed #ddd' }}>
          <h4 style={{ margin: '0 0 15px 0', color: '#007bff' }}>Quantity & Price Setting</h4>
          
          {options.map((option, index) => (
            <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
              
              {/* Tier Input */}
              <div style={{ flex: 2 }}>
                <input type="text" name="tier" value={option.tier} onChange={(e) => handleOptionChange(index, e)} required placeholder="e.g., 1kg, 5kg, Refill" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
              </div>
              
              {/* Price Input */}
              <div style={{ flex: 1.5 }}>
                <input type="number" name="price" value={option.price} onChange={(e) => handleOptionChange(index, e)} required placeholder="Price ₦" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
              </div>

              {/* Remove Row Button */}
              {options.length > 1 && (
                <button type="button" onClick={() => removeOptionField(index)} style={{ padding: '8px 12px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                  ✕
                </button>
              )}
            </div>
          ))}

          {/* Add Option Row Button */}
          <button type="button" onClick={addOptionField} style={{ marginTop: '5px', padding: '6px 12px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
            ➕ Add Another Pricing Tier
          </button>
        </div>

        <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '16px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Uploading Stock...' : 'Upload Product to Database'}
        </button>
      </form>
    </div>
  );
};

export default AdminStocker;