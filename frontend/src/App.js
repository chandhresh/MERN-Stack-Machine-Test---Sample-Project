import React, { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";


export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  // If not logged in, show Login page
  if (!token) {
    return <Login setToken={setToken} />;
  }

  return <Dashboard token={token} setToken={setToken} />;
}
