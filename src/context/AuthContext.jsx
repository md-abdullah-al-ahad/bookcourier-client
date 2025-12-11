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
import SetPasswordModal from "../components/modals/SetPasswordModal";

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
  const [passwordRequired, setPasswordRequired] = useState(false);

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

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Don't set loading to false here - let onAuthStateChanged handle it
      return userCredential.user;
    } catch (error) {
      setAuthError(error.message);
      setLoading(false);
      if (import.meta.env.DEV) {
        console.error("Login error:", error);
      }
      throw error;
    }
  };

  /**
   * Login with Google
   * @returns {Promise<object>} User object
   */
  const loginWithGoogle = async () => {
    try {
      setAuthError(null);

      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);

      // Check if this is a new user (first time signing in with Google)
      const isNewUser =
        userCredential.user.metadata.creationTime ===
        userCredential.user.metadata.lastSignInTime;

      // If new user, register in backend
      if (isNewUser) {
        try {
          await put("/users/profile", {
            name: userCredential.user.displayName,
            email: userCredential.user.email,
            photoURL: userCredential.user.photoURL,
          });
        } catch (error) {
          // Silently handle backend registration error
          // User is already created in Firebase
          if (import.meta.env.DEV) {
            console.error("Error registering Google user in backend:", error);
          }
        }
      }

      // Don't set loading to false here - let onAuthStateChanged handle it
      return userCredential.user;
    } catch (error) {
      setAuthError(error.message);
      setLoading(false);
      if (import.meta.env.DEV) {
        console.error("Google login error:", error);
      }
      throw error;
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
      // Force token refresh to get latest claims
      await firebaseUser.getIdToken(true);

      // Fetch user data including role from MongoDB
      const userData = await get("/users/profile");

      // Check if password is required
      const needsPassword =
        userData.user?.passwordRequired || userData.passwordRequired || false;
      setPasswordRequired(needsPassword);

      // Merge Firebase user with MongoDB data
      return {
        ...firebaseUser,
        role: userData.user?.role || userData.role || "user",
        mongoId: userData.user?._id || userData._id,
        passwordRequired: needsPassword,
        hasPassword:
          userData.user?.hasPassword || userData.hasPassword || false,
      };
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Error fetching user role:", error);
      }
      // Return user with default role if fetch fails
      return {
        ...firebaseUser,
        role: "user",
        passwordRequired: false,
        hasPassword: false,
      };
    }
  };

  /**
   * Refresh user data and role from backend
   * @returns {Promise<void>}
   */
  const refreshUser = async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userWithRole = await fetchUserRole(currentUser);
        setUser(userWithRole);
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Error refreshing user:", error);
      }
    }
  };

  /**
   * Handle password set completion
   * Called after user successfully sets their password
   */
  const handlePasswordSet = async () => {
    setPasswordRequired(false);
    // Refresh user data to get updated hasPassword status
    await refreshUser();
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

  // Periodically refresh user data to check for role changes
  useEffect(() => {
    if (!user) return;

    // Refresh user data every 5 minutes
    const intervalId = setInterval(() => {
      refreshUser();
    }, 5 * 60 * 1000); // 5 minutes

    // Cleanup interval
    return () => clearInterval(intervalId);
  }, [user]);

  const value = {
    user,
    loading,
    authError,
    passwordRequired,
    register,
    login,
    loginWithGoogle,
    logout,
    updateUserProfile,
    resetPassword,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      {/* Show mandatory password creation modal */}
      {passwordRequired && user && (
        <SetPasswordModal onPasswordSet={handlePasswordSet} />
      )}
    </AuthContext.Provider>
  );
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
