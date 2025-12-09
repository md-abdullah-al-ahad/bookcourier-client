import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { showError } from "../utils/toast";
import PrivateRoute from "./PrivateRoute";

/**
 * Role Based Route Component
 * Protects routes based on user roles
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authorized
 * @param {Array<string>} props.allowedRoles - Array of roles allowed to access this route
 */
const RoleBasedRoute = ({ children, allowedRoles = [] }) => {
  const { user } = useAuth();

  return (
    <PrivateRoute>
      {user && allowedRoles.includes(user.role) ? (
        children
      ) : (
        <>
          {showError(
            "Access Denied: You do not have permission to access this page"
          )}
          <Navigate to="/dashboard" replace />
        </>
      )}
    </PrivateRoute>
  );
};

export default RoleBasedRoute;
