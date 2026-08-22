import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import { getCurrentUser } from "./apis/user.api";
import Scorer from "./pages/Scorer";

const STORAGE_KEY = "ai_interviewer_user";

const App = () => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem(STORAGE_KEY);
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Failed to parse stored user:", error);
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const data = await getCurrentUser();
        const currentUser = data?.user || null;
        setUser(currentUser || user || null);
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
        <div className="h-2 bg-black animate-ping w-full"></div>
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

      <Route
        path="/scorer"
        element={user ? <Scorer user={user} setUser={setUser} /> : <Navigate to="/" replace />}
      />
      
    </Routes>
  );
};

export default App;