// authService.js
import api from '../services/api';

const endpoint = process.env.REACT_APP_API_BASE_URL;


export const loginUser = async (email, password) => {
    const response = await fetch(`${endpoint}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
  
    if (!response.ok) {
      throw new Error('Login failed');
    }
  
    const data = await response.json();
    localStorage.setItem('token', data.token);
    return data;
  };
  
  export const logoutUser = () => {
    localStorage.removeItem('token');
    // You can add any additional cleanup here, such as clearing other stored data
  };
 
export const registerUser = async(email, password) => {
    const response = await fetch(`${endpoint}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        throw new Error('Registration failed');
    }

    const data = await response.json();
    localStorage.setItem('token', data.token);
    return data;
}

export const isAuthenticated = () => {
return !!localStorage.getItem('token');
};