// authService.js
const endpoint = "http://localhost:5000";
export const loginUser = async (email, password) => {
    const response = await fetch(`${endpoint}/api/auth/login`, {
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
    const response = await fetch(`${endpoint}/api/auth/register`, {
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