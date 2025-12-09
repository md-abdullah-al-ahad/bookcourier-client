import { useState, useEffect, useRef } from "react";
import { api } from "../config/axios.config";

/**
 * Custom hook for fetching data with loading and error states
 * @param {string} url - API endpoint URL
 * @param {object} options - Axios request options
 * @returns {object} { data, loading, error, refetch }
 */
const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMountedRef = useRef(true);

  // Fetch data on mount and when url changes
  useEffect(() => {
    // Reset mounted ref to true when effect runs
    isMountedRef.current = true;

    /**
     * Fetch data from API
     */
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get(url, options);

        // Only update state if component is still mounted
        if (isMountedRef.current) {
          // Handle response structure: {success, message, data}
          // Extract the actual data from response.data
          const actualData = response?.data || response;
          setData(actualData);
          setLoading(false);
        }
      } catch (err) {
        if (isMountedRef.current) {
          setError(
            err.response?.data?.message || err.message || "Something went wrong"
          );
          setLoading(false);
        }

        if (import.meta.env.DEV) {
          console.error(`useFetch error for ${url}:`, err);
        }
      }
    };

    if (url) {
      fetchData();
    }

    // Cleanup function
    return () => {
      isMountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  /**
   * Refetch data manually
   */
  const refetch = () => {
    setLoading(true);
    setError(null);

    api
      .get(url, options)
      .then((response) => {
        if (isMountedRef.current) {
          const actualData = response?.data || response;
          setData(actualData);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMountedRef.current) {
          setError(
            err.response?.data?.message || err.message || "Something went wrong"
          );
          setLoading(false);
        }
      });
  };

  return { data, loading, error, refetch };
};

export default useFetch;
