import { api } from "../config/axios.config";

/**
 * GET request wrapper
 * @param {string} url - API endpoint
 * @param {object} config - Axios config options
 * @returns {Promise} Response data
 */
export const get = async (url, config = {}) => {
  try {
    const response = await api.get(url, config);
    return response;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error(`GET ${url} failed:`, error);
    }
    throw error;
  }
};

/**
 * POST request wrapper
 * @param {string} url - API endpoint
 * @param {object} data - Request payload
 * @param {object} config - Axios config options
 * @returns {Promise} Response data
 */
export const post = async (url, data = {}, config = {}) => {
  try {
    const response = await api.post(url, data, config);
    return response;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error(`POST ${url} failed:`, error);
    }
    throw error;
  }
};

/**
 * PUT request wrapper
 * @param {string} url - API endpoint
 * @param {object} data - Request payload
 * @param {object} config - Axios config options
 * @returns {Promise} Response data
 */
export const put = async (url, data = {}, config = {}) => {
  try {
    const response = await api.put(url, data, config);
    return response;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error(`PUT ${url} failed:`, error);
    }
    throw error;
  }
};

/**
 * PATCH request wrapper
 * @param {string} url - API endpoint
 * @param {object} data - Request payload
 * @param {object} config - Axios config options
 * @returns {Promise} Response data
 */
export const patch = async (url, data = {}, config = {}) => {
  try {
    const response = await api.patch(url, data, config);
    return response;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error(`PATCH ${url} failed:`, error);
    }
    throw error;
  }
};

/**
 * DELETE request wrapper
 * @param {string} url - API endpoint
 * @param {object} config - Axios config options
 * @returns {Promise} Response data
 */
export const del = async (url, config = {}) => {
  try {
    const response = await api.delete(url, config);
    return response;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error(`DELETE ${url} failed:`, error);
    }
    throw error;
  }
};
