import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../config/firebase.config";
import { get, put } from "../utils/api";

// Create Auth Context
const AuthContext = createContext(null);

/**
 * Auth Provider Component
 * Manages authentication state and provides auth methods
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  /**
   * Register new user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {string} name - User display name
   * @param {string} photoURL - User photo URL (optional)
   * @returns {Promise<object>} User object
   */
  const register = async (email, password, name, photoURL = "") => {
    try {
      setAuthError(null);
      setLoading(true);

      // Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update user profile
      await updateProfile(userCredential.user, {
        displayName: name,
        photoURL: photoURL,
      });

      // Reload user to get updated profile
      await userCredential.user.reload();

      // Get updated user
      const updatedUser = auth.currentUser;

      return updatedUser;
    } catch (error) {
      setAuthError(error.message);
      if (import.meta.env.DEV) {
        console.error("Registration error:", error);
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<object>} User object
   */
  const login = async (email, password) => {
    try {
      setAuthError(null);
      setLoading(true);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      return userCredential.user;
    } catch (error) {
      setAuthError(error.message);
      if (import.meta.env.DEV) {
        console.error("Login error:", error);
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login with Google
   * @returns {Promise<object>} User object
   */
  const loginWithGoogle = async () => {
    try {
      setAuthError(null);
      setLoading(true);

      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);

      return userCredential.user;
    } catch (error) {
      setAuthError(error.message);
      if (import.meta.env.DEV) {
        console.error("Google login error:", error);
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout current user
   * @returns {Promise<void>}
   */
  const logout = async () => {
    try {
      setAuthError(null);
      setLoading(true);

      await signOut(auth);
      setUser(null);
    } catch (error) {
      setAuthError(error.message);
      if (import.meta.env.DEV) {
        console.error("Logout error:", error);
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update user profile
   * @param {string} name - New display name
   * @param {string} photoURL - New photo URL
   * @returns {Promise<void>}
   */
  const updateUserProfile = async (name, photoURL) => {
    try {
      setAuthError(null);
      setLoading(true);

      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("No user logged in");
      }

      // Update Firebase profile
      await updateProfile(currentUser, {
        displayName: name,
        photoURL: photoURL,
      });

      // Update MongoDB profile
      await put("/users/profile", {
        displayName: name,
        photoURL: photoURL,
      });

      // Reload user to get updated data
      await currentUser.reload();

      // Update local user state
      setUser({ ...auth.currentUser });
    } catch (error) {
      setAuthError(error.message);
      if (import.meta.env.DEV) {
        console.error("Update profile error:", error);
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Send password reset email
   * @param {string} email - User email
   * @returns {Promise<void>}
   */
  const resetPassword = async (email) => {
    try {
      setAuthError(null);
      setLoading(true);

      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      setAuthError(error.message);
      if (import.meta.env.DEV) {
        console.error("Password reset error:", error);
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch user role from MongoDB
   * @param {object} firebaseUser - Firebase user object
   * @returns {Promise<object>} User with role data
   */
  const fetchUserRole = async (firebaseUser) => {
    try {
      // Fetch user data including role from MongoDB
      const userData = await get("/users/me");

      // Merge Firebase user with MongoDB data
      return {
        ...firebaseUser,
        role: userData.role || "user",
        mongoId: userData._id,
      };
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Error fetching user role:", error);
      }
      // Return user with default role if fetch fails
      return {
        ...firebaseUser,
        role: "user",
      };
    }
  };

  // Monitor auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in, fetch role from MongoDB
        const userWithRole = await fetchUserRole(firebaseUser);
        setUser(userWithRole);
      } else {
        // User is signed out
        setUser(null);
      }
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  const value = {
    user,
    loading,
    authError,
    register,
    login,
    loginWithGoogle,
    logout,
    updateUserProfile,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to use Auth Context
 * @returns {object} Auth context value
 * @throws {Error} If used outside AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
