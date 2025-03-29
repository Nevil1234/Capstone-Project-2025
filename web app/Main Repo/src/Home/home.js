import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import AddProductForm from '../components/AddProductForm';
import ProductDetailsModal from '../components/ProductDetailsModal';
import QRModal from '../components/QRModal';
import { PlusIcon, QrCode, ExternalLink } from 'lucide-react';

function Home() {
  const [products, setProducts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewMode, setViewMode] = useState(null); // 'qr' or 'details'

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/products');
      const data = await response.json();
      if (data.success) setProducts(data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleView = (product, mode) => {
    setSelectedProduct(product);
    setViewMode(mode);
  };

  return (
    <div className="home-container flex bg-gray-50 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 space-y-0 ml-33">
        {/* Dashboard Header */}
        <div className="flex items-center bg-white p-6 shadow-sm rounded-lg border border-gray-200">
          <h1 className="text-2xl font-semibold text-gray-700">Dashboard</h1>
        </div>

        {/* Recent Products Section */}
        <div className="bg-white p-6 shadow-sm rounded-lg border border-gray-200">
          <div className="mb-4 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Recent Products</h2>
              <p className="text-sm text-gray-500 mt-1">
                A list of all products including their verification status and QR code details.
              </p>
            </div>
            <button
              style={{ width: '150px', height: '50px' }}
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-md text-sm font-medium transition-colors"
            >
              <PlusIcon className="w-4 h-4" />
              Add Product
            </button>
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
                          onClick={() => handleView(product, 'qr')}
                          className="p-2 rounded text-blue-600 hover:bg-blue-100 bg-white"
                          title="View QR Code"
                        >
                          <QrCode className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleView(product, 'details')}
                          className="p-2 rounded text-blue-600 hover:bg-blue-100 bg-white"
                          title="View Details"
                        >
                          <ExternalLink className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modals */}
        {showAddForm && (
          <AddProductForm
            onClose={() => setShowAddForm(false)}
            onSuccess={fetchProducts}
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
      </main>
    </div>
  );
}

export default Home;