/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid email format
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * Requirements: min 8 chars, uppercase, lowercase, number, special char
 * @param {string} password - Password to validate
 * @returns {boolean} True if password meets all requirements
 */
export const validatePassword = (password) => {
  if (!password || password.length < 8) return false;

  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  return hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
};

/**
 * Validate Bangladesh phone number format
 * Accepts: +8801XXXXXXXXX, 8801XXXXXXXXX, 01XXXXXXXXX
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid Bangladesh phone format
 */
export const validatePhone = (phone) => {
  const phoneRegex = /^(\+?880|0)?1[3-9]\d{8}$/;
  return phoneRegex.test(phone.replace(/[\s-]/g, ""));
};

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid URL format
 */
export const validateURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Get password strength level
 * @param {string} password - Password to evaluate
 * @returns {string} 'weak', 'medium', or 'strong'
 */
export const getPasswordStrength = (password) => {
  if (!password) return "weak";

  let strength = 0;

  // Length check
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;

  // Character variety checks
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength++;

  // Determine strength level
  if (strength <= 2) return "weak";
  if (strength <= 4) return "medium";
  return "strong";
};
