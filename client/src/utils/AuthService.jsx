import axios from 'axios';

const API_URL = 'http://localhost:4000/api/auth/';

const signup = (email, password) => {
  return axios.post(API_URL + 'signup', {
    email,
    password
  });
};

const login = (email, password) => {
  return axios.post(API_URL + 'login', {
    email,
    password
  }).then(response => {
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  });
};

const logout = () => {
  localStorage.removeItem('user');
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

const AuthService = {
  signup,
  login,
  logout,
  getCurrentUser
};

export default AuthService;
