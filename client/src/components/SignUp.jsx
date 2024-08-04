import React, { useState, useContext } from 'react';
import axios from "axios"
// import { AuthContext } from '../context/AuthContext';

const Signup = () => {
  const apiUrl = "https://simple-fullstack-login-form.onrender.com/";
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  // const { signup } = useContext(AuthContext);

  const validateEmail = (email) => {
    const re = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name) {
      setError('Name is required');
      return;
    }

    if (!email || !validateEmail(email)) {
      setError('Please include a valid email');
      return;
    }

    if (!password || password.length < 6) {
      setError('Please enter a password with 6 or more characters');
      return;
    }

    try {
    
     await axios.post(`${apiUrl}api/auth/signup`, {
      name,
        email,
        password
      });
      console.log(email, password);
      alert('User registered successfully');
      console.log("sucessful");
      setError(" ");
    } catch (err) {
      console.log(err.response?.data?.message);
      const errorMessage = err.response?.data?.message
        ? err.response.data.message
        : 'Failed to register';
      setError(errorMessage);
      // console.log(err);
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
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
        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default Signup;
