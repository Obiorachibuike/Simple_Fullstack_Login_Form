import React, { createContext, useState, useEffect } from 'react';
import AuthService from '../utils/AuthService.jsx';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setUser(user);
    }
  }, []);

  const login = async (email, password) => {
    const response = await AuthService.login(email, password);
    setUser(response);
  };

  const signup = async (email, password) => {
    await AuthService.signup(email, password);
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext,AuthProvider};
