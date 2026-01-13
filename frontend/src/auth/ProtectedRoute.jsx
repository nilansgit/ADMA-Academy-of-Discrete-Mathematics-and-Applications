import { Navigate } from "react-router-dom";
import { isTokenExpired, clearAuthData } from "../utils/tokenUtils";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const token = window.localStorage.getItem("token");
  const role = window.localStorage.getItem("role");

  // Not logged in
  if (!token || !role) {
    return <Navigate to="/login" replace />;
  }

  // Token expired
  if (isTokenExpired(token)) {
    clearAuthData();
    alert("Your session has expired. Please sign in again to continue");
    return <Navigate to="/login" replace />;
  }

  // Check role authorization
  if (!allowedRoles.includes(role)) {
    alert("You are not authorised to access this page");
    return <Navigate to="/login" replace={true} />;
  }

  return children;
};

export default ProtectedRoute;
