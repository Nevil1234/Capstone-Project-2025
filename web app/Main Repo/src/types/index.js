/**
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} brand
 * @property {string} material
 * @property {string} sku
 * @property {string} batchNumber
 * @property {string} manufacturingDate
 * @property {string} qrCode
 * @property {number} verificationCount
 * @property {'active' | 'inactive'} status
 * @property {ProductItem[]} [items]
 */

/**
 * @typedef {Object} ProductItem
 * @property {string} id
 * @property {string} serialNumber
 * @property {string} productId
 * @property {string} manufacturingDate
 * @property {string} qrCode
 * @property {'active' | 'inactive'} status
 * @property {string} [lastVerified]
 */

/**
 * @typedef {Object} DashboardStats
 * @property {number} totalProducts
 * @property {number} totalScans
 * @property {number} activeProducts
 * @property {number} recentVerifications
 */

// Example data objects for demonstration

const exampleProduct = {
  id: 'prod-001',
  brand: 'BrandX',
  material: 'Plastic',
  sku: 'SKU12345',
  batchNumber: 'B123',
  manufacturingDate: '2025-01-01',
  qrCode: 'QR123',
  verificationCount: 10,
  status: 'active',
  items: [
    {
      id: 'item-001',
      serialNumber: 'SN001',
      productId: 'prod-001',
      manufacturingDate: '2025-01-01',
      qrCode: 'QR001',
      status: 'active',
      lastVerified: '2025-02-07'
    }
  ]
};

const dashboardStats = {
  totalProducts: 100,
  totalScans: 500,
  activeProducts: 75,
  recentVerifications: 30
};

module.exports = { exampleProduct, dashboardStats };
