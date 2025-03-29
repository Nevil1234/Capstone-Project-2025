import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import SellProductForm from '../components/SellProductForm';
import ProductDetailsModal from '../components/ProductDetailsModal';
import QRModal from '../components/QRModal';
import { QrCode, Tag } from 'lucide-react';

function Sell() {
  const [products, setProducts] = useState([
    // Adding sample product data since backend is not ready
    {
      _id: '1',
      brand: 'Sample',
      cloth_name: 'T-Shirt',
      size: 'L',
      category: 'Casual',
      material: 'Cotton',
      batch_number: 'B001',
      gender: 'Unisex',
      manufacturing_date: new Date().toISOString()
    }
  ]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showSellForm, setShowSellForm] = useState(false);
  const [viewMode, setViewMode] = useState(null);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/products');
      const data = await response.json();
      if (data.success) setProducts(data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
      // Keep using sample data if API fails
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleView = (product, mode) => {
    setSelectedProduct(product);
    setViewMode(mode);
  };

  const handleSell = (product) => {
    setSelectedProduct(product);
    setShowSellForm(true);
  };

  return (
    <div className="home-container flex bg-gray-50 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 space-y-4">
        {/* Sell Page Header */}
        <div className="flex items-center bg-white p-6 shadow-sm rounded-lg border border-gray-200">
          <h1 className="text-2xl font-semibold text-gray-700">Sell Products</h1>
        </div>

        {/* Products for Sale Section */}
        <div className="bg-white p-6 shadow-sm rounded-lg border border-gray-200">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Products Available for Sale</h2>
            <p className="text-sm text-gray-500 mt-1">
              Select a product to sell and enter the wallet addresses to process the sale.
            </p>
          </div>

          {/* Product Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Material</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Batch</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gender</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Manufactured</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product._id}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {product.brand} {product.cloth_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{product.size}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{product.category}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{product.material}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{product.batch_number}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{product.gender}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(product.manufacturing_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleSell(product)}
                          className="p-2 rounded text-green-600 hover:bg-green-100 bg-white"
                          title="Sell Product"
                        >
                          <Tag className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleView(product, 'qr')}
                          className="p-2 rounded text-blue-600 hover:bg-blue-100 bg-white"
                          title="View QR Code"
                        >
                          <QrCode className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modals */}
      {showSellForm && selectedProduct && (
        <SellProductForm
          product={selectedProduct}
          onClose={() => {
            setShowSellForm(false);
            setSelectedProduct(null);
          }}
          onProductSold={() => {
            setShowSellForm(false);
            setSelectedProduct(null);
            fetchProducts();
          }}
        />
      )}

      {selectedProduct && viewMode === 'qr' && (
        <QRModal
          product={selectedProduct}
          onClose={() => {
            setSelectedProduct(null);
            setViewMode(null);
          }}
        />
      )}

      {selectedProduct && viewMode === 'details' && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => {
            setSelectedProduct(null);
            setViewMode(null);
          }}
        />
      )}
    </div>
  );
}

export default Sell;
