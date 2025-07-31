import React, { useContext, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import HomePage from "./pages/HomePage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "./context/AuthContext";

const App = () => {
  const { authUser } = useContext(AuthContext);

  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/ping");
      const data = await res.json();
      console.log("Backend responded with:", data);
    } catch (error) {
      console.error("Error talking to backend:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="bg-[url('./src/assets/bgImage.svg')] bg-contain min-h-screen">
      <ToastContainer position="top-right" />
      <Routes>
        {/* Public route */}
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" replace />}
        />

        {/* Protected routes */}
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/profile"
          element={
            authUser ? <ProfilePage /> : <Navigate to="/login" replace />
          }
        />
      </Routes>
    </div>
  );
};

export default App;
