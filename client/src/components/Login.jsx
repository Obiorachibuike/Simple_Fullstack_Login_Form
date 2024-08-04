import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import axios from "axios"

const Login = () => {
  const apiUrl = "https://simple-fullstack-login-form.onrender.com/";
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);

  const validateEmail = (email) => {
    const re = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !validateEmail(email)) {
      setError('Please include a valid email');
      return;
    }

    if (!password) {
      setError('Password is required');
      return;
    }

    try {
     
      await  axios.post(`${apiUrl}api/auth/login`, {
        email,
        password
      });
      console.log(email,password)
      alert('User logged in successfully');
      console.log('User logged in successfully');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to login';
      console.log(err)
      setError(errorMessage);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
