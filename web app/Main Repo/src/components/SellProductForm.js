import React, { useState, useEffect } from 'react';
import SuccessModal from './SuccessModal';

// Example backend addresses (replace with actual values or fetch from backend)
const BACKEND_MANUFACTURER_ADDRESS = ' 0x1234567890abcdef1234567890abcdef12345678';
const BACKEND_BUYER_ADDRESS = '0x1234567890abcdef1234567890abcdef12345678';

function SellProductForm({ product, onClose, onProductSold }) {
  const [formData, setFormData] = useState({
    manufacturerWallet: '',
    buyerWallet: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);

  // Optional: Pre-fill form with dummy data for better UX
  useEffect(() => {
    setFormData({
      manufacturerWallet: ''
    });
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Frontend validation (can remain unchanged)
      if (formData.manufacturerWallet.length < 65 || formData.buyerWallet.length < 65) {
        alert('Please enter valid wallet addresses');
        return;
      }

      // Actual API call using backend-controlled addresses
      const response = await fetch('http://localhost:3001/api/sales/sell', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product._id,
          manufacturerWallet: BACKEND_MANUFACTURER_ADDRESS,
          buyerWallet: BACKEND_BUYER_ADDRESS
        }),
      });

      const data = await response.json();
      if (data.success) {
        setShowSuccess(true);
        onProductSold && onProductSold();
      } else {
        alert('Failed to process sale: ' + data.message);
      }
    } catch (error) {
      console.error('Error processing sale:', error);
      alert('Error processing sale. Please try again.');
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    onProductSold();
  };

  return (
    <>
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
        <div className="relative bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4">Sell Product</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Manufacturer Wallet Address
              </label>
              <input
                type="text"
                name="manufacturerWallet"
                value={formData.manufacturerWallet}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter manufacturer's wallet address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buyer Wallet Address
              </label>
              <input
                type="text"
                name="buyerWallet"
                value={formData.buyerWallet}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter buyer's wallet address"
              />
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Process Sell
              </button>
            </div>
          </form>
        </div>
      </div>

      {showSuccess && (
        <SuccessModal
          message="Product sold successfully!"
          onClose={handleSuccessClose}
        />
      )}
    </>
  );
}

export default SellProductForm;