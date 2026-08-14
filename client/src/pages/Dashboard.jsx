import React from "react";

const Dashboard = ({ user, setUser }) => {
  return <div className="text-amber-300">{user.name}</div>;
};

export default Dashboard;
