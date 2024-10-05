import React from 'react';
import axios from 'axios';
import api from '../services/api';

const FacebookLogin = ({ onLoginSuccess }) => {
  const handleFacebookLogin = () => {
    window.FB.login(function(response) {
      if (response.authResponse) {
        console.log('Welcome! Fetching your information....');
        window.FB.api('/me', { fields: 'id, name, email' }, function(userInfo) {
          console.log('Successful login for: ' + userInfo.name);
          sendTokenToBackend(response.authResponse.accessToken, userInfo);
        });
      } else {
        console.log('User cancelled login or did not fully authorize.');
      }
    }, { scope: 'email, pages_manage_posts' });
  };

  const sendTokenToBackend = async (accessToken, userInfo) => {
    try {
      const response = await api.post('/facebook/auth', { 
        accessToken, 
        userInfo 
      });
      if (response.data.success) {
        onLoginSuccess(response.data);
      } else {
        console.error('Backend authentication failed');
      }
    } catch (error) {
      console.error('Error sending token to backend:', error);
    }
  };

  return (
    <button onClick={handleFacebookLogin} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
     Connect Facebook Account
    </button>
  );
};

export default FacebookLogin;