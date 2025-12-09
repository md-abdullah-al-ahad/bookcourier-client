import toast from 'react-hot-toast';

/**
 * Show success toast message
 * @param {string} message - Success message to display
 * @returns {string} Toast ID
 */
export const showSuccess = (message) => {
  return toast.success(message, {
    duration: 3000,
    style: {
      background: '#10b981',
      color: '#ffffff',
      padding: '16px',
      borderRadius: '8px',
      fontWeight: '500'
    },
    iconTheme: {
      primary: '#ffffff',
      secondary: '#10b981'
    }
  });
};

/**
 * Show error toast message
 * @param {string} message - Error message to display
 * @returns {string} Toast ID
 */
export const showError = (message) => {
  return toast.error(message, {
    duration: 4000,
    style: {
      background: '#ef4444',
      color: '#ffffff',
      padding: '16px',
      borderRadius: '8px',
      fontWeight: '500'
    },
    iconTheme: {
      primary: '#ffffff',
      secondary: '#ef4444'
    }
  });
};

/**
 * Show info toast message
 * @param {string} message - Info message to display
 * @returns {string} Toast ID
 */
export const showInfo = (message) => {
  return toast(message, {
    duration: 3000,
    icon: 'ℹ️',
    style: {
      background: '#3b82f6',
      color: '#ffffff',
      padding: '16px',
      borderRadius: '8px',
      fontWeight: '500'
    }
  });
};

/**
 * Show warning toast message
 * @param {string} message - Warning message to display
 * @returns {string} Toast ID
 */
export const showWarning = (message) => {
  return toast(message, {
    duration: 3500,
    icon: '⚠️',
    style: {
      background: '#f59e0b',
      color: '#ffffff',
      padding: '16px',
      borderRadius: '8px',
      fontWeight: '500'
    }
  });
};

/**
 * Show loading toast message
 * @param {string} message - Loading message to display
 * @returns {string} Toast ID
 */
export const showLoading = (message) => {
  return toast.loading(message, {
    style: {
      background: '#6b7280',
      color: '#ffffff',
      padding: '16px',
      borderRadius: '8px',
      fontWeight: '500'
    }
  });
};

/**
 * Dismiss a specific toast or all toasts
 * @param {string} toastId - Optional toast ID to dismiss. If not provided, dismisses all toasts
 */
export const dismissToast = (toastId) => {
  if (toastId) {
    toast.dismiss(toastId);
  } else {
    toast.dismiss();
  }
};

/**
 * Show a custom toast with promise handling
 * @param {Promise} promise - Promise to handle
 * @param {object} messages - Messages object with loading, success, and error
 * @returns {Promise} Original promise
 */
export const showPromise = (promise, messages) => {
  return toast.promise(
    promise,
    {
      loading: messages.loading || 'Loading...',
      success: messages.success || 'Success!',
      error: messages.error || 'Something went wrong!'
    },
    {
      style: {
        padding: '16px',
        borderRadius: '8px',
        fontWeight: '500'
      },
      success: {
        duration: 3000,
        style: {
          background: '#10b981',
          color: '#ffffff'
        }
      },
      error: {
        duration: 4000,
        style: {
          background: '#ef4444',
          color: '#ffffff'
        }
      }
    }
  );
};
