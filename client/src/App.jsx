import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import { getCurrentUser } from "./apis/user.api";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const data = await getCurrentUser();
        setUser(data?.user || null);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  if (loading) {
    return (
      <div className="fixed top-0 left-0 w-full z-9999">
        <div className="h-8 bg-black animate-ping w-full"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/dashboard"
        element={user ? <Dashboard user={user} setUser={setUser} /> : <Navigate to="/" replace />}
      />
      <Route
        path="/"
        element={user ? <Navigate to="/dashboard" replace /> : <Home setUser={setUser} />}
      />
    </Routes>
  );
};

export default App;