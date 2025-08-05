// Utility functions for Quantify app

/**
 * Format currency values
 * @param {number} amount - The amount to format
 * @param {string} currency - Currency code (default: 'USD')
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

/**
 * Format numbers with commas
 * @param {number} num - The number to format
 * @returns {string} Formatted number string
 */
export const formatNumber = (num) => {
  return new Intl.NumberFormat('en-US').format(num);
};

/**
 * Calculate stock status based on quantity and thresholds
 * @param {number} quantity - Current stock quantity
 * @param {number} lowThreshold - Low stock threshold (default: 10)
 * @param {number} outOfStockThreshold - Out of stock threshold (default: 0)
 * @returns {string} Stock status: 'out-of-stock', 'low-stock', or 'in-stock'
 */
export const getStockStatus = (quantity, lowThreshold = 10, outOfStockThreshold = 0) => {
  if (quantity <= outOfStockThreshold) {
    return 'out-of-stock';
  } else if (quantity <= lowThreshold) {
    return 'low-stock';
  } else {
    return 'in-stock';
  }
};

/**
 * Generate a random SKU
 * @param {string} prefix - SKU prefix (default: 'SKU')
 * @returns {string} Generated SKU
 */
export const generateSKU = (prefix = 'SKU') => {
  const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}${randomNum}`;
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
