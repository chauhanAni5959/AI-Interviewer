import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import { getCurrentUser } from "./apis/user.api";
import { div } from "framer-motion/client";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const data = await getCurrentUser();
      setUser(data.user);
      setLoading(false);
    };
    getUser();
  }, []);

  if (loading) {
    return (
      <div className="fixed top-0 left-0 w-full z-9999 ">
        <div className="h-8  bg-black animate-ping w-full"></div>
      </div>
    );
  }
  return (
    <>
      <Routes>
        <Route
          path="/dashboard"
          element={<Dashboard user={user} setUser={setUser} />}
        />
        <Route path="/" element={<Home setUser={setUser} />} />
      </Routes>
    </>
  );
};

export default App;
