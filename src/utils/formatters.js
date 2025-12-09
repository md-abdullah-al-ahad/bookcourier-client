/**
 * Format date to "MMM DD, YYYY"
 * @param {Date|string} date - Date object or ISO string
 * @returns {string} Formatted date
 */
export const formatDate = (date) => {
  const d = new Date(date);
  const options = { year: "numeric", month: "short", day: "2-digit" };
  return d.toLocaleDateString("en-US", options);
};

/**
 * Format date and time to "MMM DD, YYYY HH:MM AM/PM"
 * @param {Date|string} date - Date object or ISO string
 * @returns {string} Formatted date and time
 */
export const formatDateTime = (date) => {
  const d = new Date(date);
  const dateOptions = { year: "numeric", month: "short", day: "2-digit" };
  const timeOptions = { hour: "2-digit", minute: "2-digit", hour12: true };

  const datePart = d.toLocaleDateString("en-US", dateOptions);
  const timePart = d.toLocaleTimeString("en-US", timeOptions);

  return `${datePart} ${timePart}`;
};

/**
 * Format amount to Bangladeshi Taka currency
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return `৳ ${formatted}`;
};

/**
 * Get relative time from now
 * @param {Date|string} date - Date object or ISO string
 * @returns {string} Relative time string
 */
export const relativeTime = (date) => {
  const now = new Date();
  const then = new Date(date);
  const diffInSeconds = Math.floor((now - then) / 1000);

  if (diffInSeconds < 60) {
    return "just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} ${diffInMonths === 1 ? "month" : "months"} ago`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} ${diffInYears === 1 ? "year" : "years"} ago`;
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;

  return text.substring(0, maxLength).trim() + "...";
};
