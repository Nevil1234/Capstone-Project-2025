import React from 'react';
import { X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const QRModal = ({ product, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{product.brand} QR Code</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1"
            style={{ height: 35, width: 35 }}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="flex flex-col items-center">
        <QRCodeSVG
            value={product.ipfs_url}
            size={256}
            level="H"
            includeMargin
            fgColor="#000080"      // Example foreground color (navy)
            bgColor="#f0f0f0"      // Example background color (light gray)
            imageSettings={{
              src: '/path/to/logo.png',  // Add a small logo in center
              x: undefined,
              y: undefined,
              height: 40,
              width: 40,
              excavate: true
            }}
            className="mb-4"
          />
          <p className="text-sm text-gray-600 mt-2">
            Scan to view product details
          </p>
          <div className="mt-4 text-sm text-gray-500">
            NFT ID: {product.nft_id}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRModal;