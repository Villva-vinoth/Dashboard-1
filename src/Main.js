import React from "react";
import Login from "./scenes/Login/Login";
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./scenes/Routers/AuthContext";
import PageNotFound from "./scenes/Routers/PageNotFound";
import App from "./App";
import PrivateRoute from "./scenes/Routers/PrivateRoute";

const Main = () => {
  return (
    <div>
      {/* <App /> */}
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="*" element={<PageNotFound />} />
          <Route
            path="/admin/*"
            element={
              <PrivateRoute allowedRoles="admin">
                <App />
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </div>
  );
};

export default Main;
