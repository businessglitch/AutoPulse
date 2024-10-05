import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import InventoryList from './InventoryList';
import FacebookPostPreview from './FacebookPostPreview';
import FacebookLogin from './FacebookLogin';
import { ArrowLeft, Facebook, Check, X } from 'lucide-react';

import api from '../services/api';

const InventoryPage = () => {
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [selectedCars, setSelectedCars] = useState([]);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inventoryError, setinventoryError] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [facebookPages, setFacebookPages] = useState([]);
  const [posting, setPosting] = useState(false);
  const [postSuccess, setPostSuccess] = useState(null);
  const [isLoggedInToFacebook, setIsLoggedInToFacebook] = useState(false);
  const [selectedPage, setSelectedPage] = useState('');

  const handleSelectCar = (carId) => {
    setSelectedCars(prev => 
      prev.includes(carId) 
        ? prev.filter(id => id !== carId)
        : [...prev, carId]
    );
  };

  const handlePostToFacebook = async () => {
    setPosting(true);
    console.log("clickend post to fb")
    try {
      for (const carId of selectedCars) {
        const car = cars.find(c => c._id === carId);
        const message = `Check out this ${car.year} ${car.make} ${car.model}!\n` +
                        `Price: $${car.price}\n` +
                        `Mileage: ${car.mileage} miles\n` +
                        `Contact us for more information. (ID: ${car.uniqueId})`;

        const response = await api.post('/facebook/post-to-facebook', 
          { 
            pageId: selectedPage,
            message: message
          }
        );

        if (response.data.success) {
          console.log(`Successfully posted car ${car.vin} to Facebook`);
        } else {
          console.error(`Failed to post car ${car.vin} to Facebook`);
        }
      }
      alert('Successfully posted selected cars to Facebook!');
      setSelectedCars([]);
    } catch (error) {
      console.error('Error posting to Facebook:', error);
      alert('Failed to post to Facebook. Please try again.');
    } finally {
      setPosting(false);
    }
  };

  const handleFacebookLoginSuccess = (data) => {
    setIsLoggedInToFacebook(true);
    setFacebookPages(data.pages);
    // You might want to store the user info in your app's state or context
  };

  useEffect(() => {
    const fetchInventory = async () => {
        if(!selectedBusiness) return;
        console.log("selected business", selectedBusiness);
      try {
        const response = await api.get(`/inventory/${selectedBusiness}`);
        setCars(response.data);
        console.log("cars", response.data);
        setLoading(false);
      } catch (err) {
        setinventoryError('Failed to fetch inventory');
        setLoading(false);
      }
    };

    fetchInventory();
  }, [selectedBusiness]);
  
  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await api.get('/businesses');
        setBusinesses(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch businesses');
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
        <Link to="/dashboard" className="flex items-center text-indigo-600 hover:text-indigo-800 mb-4">
            <ArrowLeft size={20} className="mr-2" />
            Back to Dashboard
        </Link>

      <h1 className="text-3xl font-bold mb-6">Inventory Management</h1>

        <div className="mt-8 gap-6">
        {!isLoggedInToFacebook ? (
        <FacebookLogin onLoginSuccess={handleFacebookLoginSuccess} />
        ) : (
            <div className='flex flex-inline gap-2'>
                <p>Select a page to post on:</p>
              <select 
                value={selectedPage} 
                onChange={(e) => setSelectedPage(e.target.value)}
              >
                <option value="">Select a Page</option>
                {facebookPages.map(page => (
                  <option key={page.id} value={page.id}>{page.name}</option>
                ))}
              </select>
              {/* <button onClick={handlePostToFacebook} disabled={!selectedPage || selectedCars.length === 0}>
                Post Selected Cars to Facebook
              </button> */}
            </div>
          )}
        </div>
        <div className='mt-5 flex flex-inline'>
            <button 
                onClick={handlePostToFacebook} 
                disabled={selectedCars.length === 0 || !selectedPage}
                className={`flex items-center justify-center px-4 py-2 rounded-md text-white ${
                selectedCars.length > 0 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
                } transition-colors duration-300`}
            >
                <Facebook className="inline-block mr-2" />
                {posting ? 'Posting...' : `Post ${selectedCars.length} car${selectedCars.length !== 1 ? 's' : ''} to Facebook`}
            </button>
            <button
                onClick={() => setShowPreview(true)}
                disabled={selectedCars.length === 0}
                className="ml-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-300"
                >
                Preview Post
            </button>
        </div>
       
      

        {postSuccess !== null && (
        <div className={`mb-4 p-4 rounded-md ${postSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {postSuccess ? (
            <p className="flex items-center"><Check size={20} className="mr-2" /> Successfully posted to Facebook!</p>
            ) : (
            <p className="flex items-center"><X size={20} className="mr-2" /> Failed to post to Facebook. Please try again.</p>
            )}
        </div>
        )}
      <div className="my-8 flex flex w-full flex-inline">
        <p className="text-l mb-4">Select a Dealership</p>
        <select 
          onChange={(e) => setSelectedBusiness(e.target.value)}
          className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="">Select a dealership</option>
          {businesses.map(business => (
            <option key={business._id} value={business._id}>{business.name}</option>
          ))}
        </select>
      </div>

      
        <div>
          <h2 className="text-2xl font-semibold mb-4">Inventory</h2>
          <InventoryList cars={cars} handleSelectCar={handleSelectCar} selectedCars={selectedCars}/>
        </div>
        {showPreview && (
            <FacebookPostPreview
                selectedCars={cars.filter(car => selectedCars.includes(car._id))}
                onClose={() => setShowPreview(false)}
            />
        )}
    </div>
  );
};

export default InventoryPage;