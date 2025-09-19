import React, { useState } from 'react';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('admin123'); // <-- use correct password here
  const [err, setErr] = useState('');

  const login = async (e) => {
    e.preventDefault();
    setErr('');

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/login`,
        { email, password }
      );

      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        window.location.href = '/'; // redirect to dashboard
      } else {
        setErr('Unexpected server response');
      }
    } catch (error) {
      setErr(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="center">
      <form onSubmit={login} className="card">
        <h2>Admin Login</h2>
        {err && <div className="err">{err}</div>}
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">Login</button>
        <p style={{ fontSize: 12 }}>
          ONLY THE ADMIN CAN LOGIN WHILE WE INSERTED 
          USING THUNDERCLIENT ON VS CODE
        </p>
      </form>
    </div>
  );
}
