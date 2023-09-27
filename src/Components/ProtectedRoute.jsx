import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

function ProtectedRoute({ element }) {
  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    return !!token;
  };

  const ProtectedRouteComponent = () => {
    if (isAuthenticated()) {
      return element;
    } else {
      alert("Please log in first.");
      return <Navigate to="/" />;
    }
  };

  return <ProtectedRouteComponent />;
}

ProtectedRoute.propTypes = {
  element: PropTypes.element.isRequired,
};

export default ProtectedRoute;
