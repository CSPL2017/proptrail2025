import { Navigate } from "react-router-dom";
const ProtectedRoute = ({ element }) => {
  const isAuthenticated = localStorage.getItem("USER_TOKEN");
  return isAuthenticated ? element : <Navigate to="/" replace />;
};
export default ProtectedRoute;