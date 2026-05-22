import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Storefront() {
  const [products, setProducts] = useState([]); // 💡 Holds data from database
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedTiers, setSelectedTiers] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 📡 Fetch real-time products from the backend when the page loads
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://ths-egaz.onrender.com');
        setProducts(response.data);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter items based on active tab
  const filteredProducts = products.filter(p => activeCategory === 'all' || p.category === activeCategory);

  const handleTierChange = (productId, index) => {
    setSelectedTiers(prev => ({ ...prev, [productId]: index }));
  };

  const handleBuyNow = (product) => {
    const chosenIndex = selectedTiers[product._id] || 0; // MongoDB uses _id
    const selectedOption = product.options[chosenIndex];

    const orderSummary = {
      vegetableName: product.name,
      quantity: selectedOption.tier,
      totalPrice: selectedOption.price
    };

    navigate('/checkout', { state: orderSummary });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold text-green-700">THS GAS & VEGETABLE SHOP</h1>
        <p className="text-gray-600 mt-2">Amadi-Ama Community, Port Harcourt</p>
      </header>

      {/* Category Filter Tabs */}
      <div className="flex justify-center space-x-4 mb-8">
        {['all', 'vegetables', 'gas'].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2 rounded-full font-semibold capitalize transition ${
              activeCategory === cat ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {cat === 'all' ? 'Show All' : cat}
          </button>
        ))}
      </div>

      {/* Grid Display */}
      {filteredProducts.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">No items available at the moment.</p>
      ) : (
        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
          {filteredProducts.map((product) => {
            const chosenIndex = selectedTiers[product._id] || 0;
            const activeOption = product.options[chosenIndex];

            return (
              <div key={product._id} className="border rounded-xl shadow-sm hover:shadow-md transition overflow-hidden bg-white">
                <img src={product.image} alt={product.name} className="h-48 w-full object-cover" />
                <div className="p-4">
                  <h3 className="text-xl font-bold text-gray-800">{product.name}</h3>
                  
                  {/* Bulk Tier Selector */}
                  <div className="mt-3">
                    <label className="block text-xs font-semibold text-gray-500 uppercase">Select Size</label>
                    <select 
                      onChange={(e) => handleTierChange(product._id, parseInt(e.target.value))}
                      className="w-full mt-1 p-2 border rounded-md text-gray-700 bg-gray-50 focus:outline-green-500"
                    >
                      {product.options.map((opt, idx) => (
                        <option key={idx} value={idx}>{opt.tier}</option>
                      ))}
                    </select>
                  </div>

                  {/* Dynamic Price Display */}
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-gray-400 block">Total Price</span>
                      <span className="text-2xl font-black text-green-600">₦{activeOption?.price.toLocaleString()}</span>
                    </div>
                    <button
                      onClick={() => handleBuyNow(product)}
                      className="bg-green-600 text-white font-bold px-6 py-2 rounded-lg hover:bg-green-700 transition"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}