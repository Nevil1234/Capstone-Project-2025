import React, { useState } from "react";
import { QrCode, X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { set } from "mongoose";

function AddProductForm({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    brand: "",
    clothName: "",
    size: "",
    category: "",
    material: "",
    manufacturingDate: "",
    gender: "",
    image: null,
    batchNumber: "",
  });
  const childishEncrypt = (text) => {
    // Super simple "encryption" using Base64 and a string reversal
    return btoa(text).split('').reverse().join('');
  };
  const [qrData, setQrData] = useState(null);
  const [uniqueId, setUniqueId] = useState("");
  const [storedQrData, setStoredQrData] = useState(null);
  const[showQrCode, setShowQrCode] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const requiredFields = [
        "brand",
        "clothName",
        "size",
        "category",
        "material",
        "manufacturingDate",
        "gender",
        "batchNumber",
      ];
      for (const field of requiredFields) {
        if (!formData[field]) {
          alert("Please fill all the required fields");
          return;
        }
      }

      if (!formData.image) {
        throw new Error("Image is required");
      }

      const submissionData = new FormData();
      submissionData.append("image", formData.image);
      const dataToSend = {
        ...formData,
        manufacturingDate: new Date(formData.manufacturingDate).toISOString(),
      };
      submissionData.append("data", JSON.stringify(dataToSend));

      const response = await fetch("http://localhost:3001/api/products", {
        method: "POST",
        body: submissionData,
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add product");
      }

      const data = await response.json();
      console.log("Response:", data);

     

      if (data.success) {
        console.log("Submission successful:", data.product);
        const encryptedData = childishEncrypt(data.product.ipfs_url);
        setQrData(encryptedData);
        setUniqueId(data.product._id);
        setStoredQrData(encryptedData);
        alert("Product added successfully!");
        onSuccess && onSuccess();
        // onClose();
      } else {
        throw new Error(data.error || "Failed to add product");
      }
    } catch (err) {
      console.error("Submission failed:", err);
      alert("Failed to add product: " + err.message);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-0 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-xl font-semibold text-gray-900">
            Add New Product
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
            style={{ width: 45 }}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            {/* Brand Name */}
            <div>
              <label
                htmlFor="brand"
                className="block text-sm font-medium text-gray-700"
              >
                Brand Name
              </label>
              <input
                type="text"
                id="brand"
                name="brand"
                required
                value={formData.brand}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                style={{
                  height: 25,
                  padding: "9px 7px",
                }}
              />
            </div>
            <div>
              <label
                htmlFor="clothName"
                className="block text-sm font-medium text-gray-700"
              >
                Cloth Name
              </label>
              <input
                type="text"
                id="clothName"
                name="clothName"
                required
                value={formData.clothName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                style={{
                  height: 25,
                  padding: "9px 7px",
                }}
              />
            </div>

            {/* size  */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Size
              </label>
              <select
                name="size"
                value={formData.size}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                style={{
                  height: 25,
                  // padding: '9px 7px',
                  marginBottom: 10,
                }}
              >
                <option value="">Select Size</option>
                <option value="S">Small</option>
                <option value="M">Medium</option>
                <option value="L">Large</option>
              </select>
            </div>
            {/* category */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                style={{
                  height: 25,
                  padding: "9px 7px",
                  marginBottom: 10,
                }}
                required
              />
            </div>
            {/* material */}
            <div>
              <label
                htmlFor="material"
                className="block text-sm font-medium text-gray-700"
              >
                Material
              </label>
              <input
                type="text"
                id="material"
                name="material"
                required
                value={formData.material}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                style={{
                  height: 25,
                  padding: "9px 7px",
                  marginBottom: 10,
                }}
              />
            </div>

            <div>
              <label
                htmlFor="batchNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Batch Number
              </label>
              <input
                type="text"
                id="batchNumber"
                name="batchNumber"
                required
                value={formData.batchNumber}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                style={{
                  height: 25,
                  padding: "9px 7px",
                  marginBottom: 10,
                }}
              />
            </div>
            {/* manufacturingDate */}
            <div>
              <label
                htmlFor="manufacturingDate"
                className="block text-sm font-medium text-gray-700"
              >
                Manufacturing Date
              </label>
              <input
                type="date"
                id="manufacturingDate"
                name="manufacturingDate"
                required
                value={formData.manufacturingDate}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                style={{
                  height: 25,
                  padding: "9px 7px",
                  marginBottom: 10,
                }}
              />
            </div>

            {/* gender select */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                style={{
                  height: 25,
                  marginBottom: 10,
                }}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Unisex">Unisex</option>
              </select>
            </div>

            {/* Image upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Image
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className="mt-1 block w-full text-sm"
                required
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add Product
            </button>
          </div>
        </form>

        {/* Display QR code if available */}
        {qrData && (
          <div className="p-6 flex flex-col items-center">
            <h3 className="mb-2 text-gray-700">NFT ID: {uniqueId}</h3>
            

            <QRCodeSVG value={qrData} size={200} level="H" includeMargin />
            <p className="text-sm text-gray-500 mt-2">
              Scan the QR code to view the product details
            </p>
          
          </div> 
        )}
      </div>
    </div>
  );
}
export default AddProductForm;