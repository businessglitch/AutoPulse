import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '../services/authService'; // Import the logout function
import { Users } from 'lucide-react';


const Header = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');

  const handleLogout = () => {
    logoutUser(); // This function should clear the token from localStorage
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-indigo-600">
          <Link to="/" className="hover:text-indigo-800 transition-colors">AutoPulse</Link>
        </h1>
        <nav>
          {isAuthenticated ? (
            <div className="flex items-center">
                <Link 
              to="/inventory" 
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 transition-colors duration-300"
            >
              Inventory
              {/* <Users className="ml-2 -mr-1 h-5 w-5" /> */}
            </Link>
              <Link 
                to="/dashboard" 
                className="text-indigo-600 hover:text-indigo-800 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 mr-2"
              >
                Dashboard
              </Link>
              <button 
                onClick={handleLogout}
                className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link 
                to="/login" 
                className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 mr-2"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300 shadow-md hover:shadow-lg"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;