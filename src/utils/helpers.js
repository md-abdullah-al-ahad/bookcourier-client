/**
 * Smooth scroll to top of page
 */
export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

/**
 * Get DaisyUI color class based on order status
 * @param {string} status - Order status
 * @returns {string} DaisyUI color class
 */
export const getStatusColor = (status) => {
  const statusColors = {
    pending: "warning",
    processing: "info",
    approved: "success",
    delivered: "success",
    completed: "success",
    cancelled: "error",
    rejected: "error",
    returned: "error",
    "in-transit": "info",
    shipped: "info",
    confirmed: "success",
  };

  return statusColors[status?.toLowerCase()] || "neutral";
};

/**
 * Get badge classes for different statuses
 * @param {string} status - Status string
 * @returns {string} Combined badge class names
 */
export const getStatusBadgeClass = (status) => {
  const color = getStatusColor(status);
  return `badge badge-${color}`;
};

/**
 * Get user role badge class
 * @param {string} role - User role
 * @returns {string} Badge class names
 */
export const getRoleBadgeClass = (role) => {
  const roleColors = {
    admin: "badge-error",
    librarian: "badge-primary",
    user: "badge-secondary",
  };

  return `badge ${roleColors[role?.toLowerCase()] || "badge-neutral"}`;
};

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error("Failed to copy to clipboard:", error);
    }
    return false;
  }
};

/**
 * Generate random ID
 * @param {number} length - Length of ID
 * @returns {string} Random ID string
 */
export const generateId = (length = 8) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, delay = 300) => {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

/**
 * Check if object is empty
 * @param {object} obj - Object to check
 * @returns {boolean} True if empty
 */
export const isEmptyObject = (obj) => {
  return Object.keys(obj).length === 0;
};
