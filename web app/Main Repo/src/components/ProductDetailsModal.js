import React from 'react';
import { X } from 'lucide-react';

const ProductDetailsModal = ({ product, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Product Details</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1"
            style={{ width: 35, height: 35}}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <DetailItem label="Brand" value={product.brand} />
          <DetailItem label="Product Name" value={product.cloth_name} />
          <DetailItem label="Category" value={product.category} />
          <DetailItem label="Material" value={product.material} />
          <DetailItem label="Size" value={product.size} />
          <DetailItem label="Gender" value={product.gender} />
          <DetailItem label="Batch Number" value={product.batch_number} />
          <DetailItem 
            label="Manufacturing Date" 
            value={new Date(product.manufacturing_date).toLocaleDateString()} 
          />
          <DetailItem label="NFT ID" value={product.nft_id} />
          <div className="col-span-2">
            <DetailItem 
              label="IPFS URL" 
              value={product.ipfs_url} 
              isUrl={true} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ label, value, isUrl = false }) => (
  <div className="text-sm">
    <dt className="font-medium text-gray-500">{label}</dt>
    <dd className="mt-1 text-gray-900 break-all">
      {isUrl ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {value}
        </a>
      ) : (
        value
      )}
    </dd>
  </div>
);

export default ProductDetailsModal;