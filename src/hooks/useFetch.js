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
        setData(response);
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

  /**
   * Refetch data manually
   */
  const refetch = () => {
    fetchData();
  };

  // Fetch data on mount and when url changes
  useEffect(() => {
    if (url) {
      fetchData();
    }

    // Cleanup function
    return () => {
      isMountedRef.current = false;
    };
  }, [url]);

  return { data, loading, error, refetch };
};

export default useFetch;
