import React from "react";
import { useAuth } from "./AuthContext";
import { Navigate } from "react-router-dom";
import PageNotFound from "./PageNotFound";
// import PageNotFound from '../PageNotFound';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { isAuthenticate, roleType } = useAuth();
  console.log("---", allowedRoles, roleType);

  console.log("roleTYpe", roleType);
  if (!isAuthenticate) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles == "admin" && roleType == 0) {
    return children;
  }
  return <PageNotFound />;
};

export default PrivateRoute;
