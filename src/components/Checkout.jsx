import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();

  // Grab passed details from Storefront state or fall back gracefully
  const orderDetails = location.state || { 
    itemName: "Unknown Item", 
    quantity: "N/A", 
    price: 0 // or totalPrice depending on how you passed it
  };

  // Form states only for what the user needs to input
  const [formData, setFormData] = useState({
    buyerName: '',
    phoneNumber: '',
    deliveryAddress: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle text input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Construct the payload by merging storefront details and form inputs
    // This creates a flat object with all 6 required fields matching your backend logic
    const payload = {
      // This checks orderDetails.itemName, orderDetails.name, and orderDetails.item 
      // to ensure something sticks!
      itemName: orderDetails.itemName || orderDetails.name || orderDetails.item || "Cooking Gas Refill",
      quantity: orderDetails.quantity,
      totalPrice: orderDetails.totalPrice || orderDetails.price,
      buyerName: formData.buyerName,
      phoneNumber: formData.phoneNumber,
      deliveryAddress: formData.deliveryAddress
    };
    try {
      const response = await axios.post('https://ths-egaz.onrender.com/api/orders', payload);
      
      if (response.data.success || response.status === 200 || response.status === 201) {
        alert('Order placed successfully!');
        navigate('/'); // Redirect back to store floor on success
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Server Error: Could not process order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md border border-gray-100">
        
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Complete Delivery Details
        </h2>

        {/* 🔒 Read-Only Summary Section */}
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6 space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500 font-medium">Item:</span>
            <span className="text-gray-800 font-bold">{orderDetails.itemName}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500 font-medium">Size / Quantity:</span>
            <span className="text-gray-800 font-semibold bg-gray-200 px-2 py-0.5 rounded text-xs">
              {orderDetails.quantity}
            </span>
          </div>
          <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
            <span className="text-gray-700 font-semibold">Total Price:</span>
            <span className="text-green-600 font-extrabold text-lg">
              ₦{(orderDetails.totalPrice || orderDetails.price)?.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Error Alert Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100">
            {error}
          </div>
        )}

        {/* 📝 User Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="buyerName"
              value={formData.buyerName}
              onChange={handleChange}
              required
              placeholder="e.g. John Doe"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              placeholder="e.g. +2347077975978"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">
              Delivery Address
            </label>
            <textarea
              name="deliveryAddress"
              value={formData.deliveryAddress}
              onChange={handleChange}
              required
              rows="3"
              placeholder="Enter your complete street address"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all text-sm resize-none"
            />
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-bold text-white tracking-wide shadow-sm transition-all ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700 active:scale-[0.99]'
            }`}
          >
            {loading ? 'Processing Order...' : 'Confirm & Place Order'}
          </button>
        </form>

      </div>
    </div>
  );
}