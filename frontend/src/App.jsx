import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ScrapedDataPage from './components/ScrapedDataPage';
import LandingPage from './components/LandingPage';
import Header from './components/Header';
import LeadManagementPage from './components/LeadManagementPage';
import LeadForm from './components/LeadForm';



const PrivateRoute = ({ children }) => {
    const isAuthenticated = !!localStorage.getItem('token');
    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <div className="App flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto mt-8 px-4">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/lead-form" element={<LeadForm />} />
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          <Route 
              path="/lead-management" 
              element={
                <PrivateRoute>
                  <LeadManagementPage />
                </PrivateRoute>
              } 
            />
          <Route 
            path="/scraped-job-details/:scrapeId" 
            element={
              <PrivateRoute>
                <ScrapedDataPage />
              </PrivateRoute>
            } 
          />
        </Routes>
      </main>

      <footer className="bg-gray-800 text-white py-4 mt-8">
        <div className="container mx-auto px-4">
          <p>&copy; 2024 AutoPulse. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;