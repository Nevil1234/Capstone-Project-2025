import React, { useState } from 'react';
import { Edit, Trash, ChevronDown, ChevronUp, QrCode, ExternalLink } from 'lucide-react';

function ProductItemsTable({ items }) {
  return (
    <div className="mt-4 overflow-x-auto bg-gray-50 p-4 rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Serial Number</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Manufacturing Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Last Verified</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {items.map((item) => (
            <tr key={item.id}>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 font-medium">
                {item.serialNumber}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {new Date(item.manufacturingDate).toLocaleDateString()}
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                  item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {item.status}
                </span>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {item.lastVerified ? new Date(item.lastVerified).toLocaleDateString() : 'Never'}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                <div className="flex items-center space-x-3">
                  <button 
                    className="flex items-center text-blue-600 hover:text-blue-900"
                    title="View QR Code"
                  >
                    <QrCode className="h-4 w-4" />
                  </button>
                  <button 
                    className="flex items-center text-indigo-600 hover:text-indigo-900"
                    title="View Details"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ProductList({ products }) {
  const [expandedProduct, setExpandedProduct] = useState(null);

  const toggleExpand = (productId) => {
    setExpandedProduct(expandedProduct === productId ? null : productId);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="w-8 px-6 py-3"></th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Product</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">SKU</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Batch</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Verifications</th>
            <th className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {products.map((product) => (
            <React.Fragment key={product.id}>
              <tr className={expandedProduct === product.id ? 'bg-gray-50' : ''}>
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleExpand(product.id)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {expandedProduct === product.id ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </button>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center">
                    <div>
                      <div className="font-medium text-gray-900">{product.brand}</div>
                      <div className="text-sm text-gray-500">{product.material}</div>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{product.sku}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{product.batchNumber}</td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                    product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {product.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {product.verificationCount}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
              {expandedProduct === product.id && product.items && (
                <tr>
                  <td colSpan={7} className="px-6 py-4">
                    <ProductItemsTable items={product.items} />
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}