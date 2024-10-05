import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import FacebookPostPreview from './FacebookPostPreview';
import { ArrowLeft, ExternalLink, Facebook, Check, X,Copy, Plus, Minus, RefreshCw } from 'lucide-react';
import api from '../services/api';
import FacebookLogin from './FacebookLogin';



// Helper function to generate a unique identifier
const generateUniqueId = () => {
    return 'AP' + Math.random().toString(36).substr(2, 9).toUpperCase();
  };
  
  // Mock data - replace this with actual API call
  const mockScrapedData = {
    '1': { scrapeJob:{ 
            business:{name:"Sms Motor", url:"https://fahadhayat.com/"}, 
            scrapedAt: "1 day ago", 
            status:"pending",
            newCars: 10,
            soldCars:0,
            updatedCars:10,
          },
        
        cars:[
          { id: 1, uniqueId: generateUniqueId(), make: 'Toyota', model: 'Camry', year: 2018, price: 15000, mileage: 50000, image: 'https://example.com/camry.jpg'},
          { id: 2, uniqueId: generateUniqueId(), make: 'Honda', model: 'Civic', year: 2019, price: 16000, mileage: 40000, image: 'https://example.com/civic.jpg' },
          { id: 3, uniqueId: generateUniqueId(), make: 'Ford', model: 'Fusion', year: 2017, price: 14000, mileage: 60000, image: 'https://example.com/fusion.jpg' }
        ]
      },
    '2': 
    { scrapeJob:{ business:{name:"Fahad Hayat"}, scrapedAt: "1 day ago", status:"failed"},
    cars:[
      { id: 1, uniqueId: generateUniqueId(), make: 'Toyota', model: 'Camry', year: 2018, price: 15000, mileage: 50000, image: 'https://example.com/camry.jpg'},
      { id: 2, uniqueId: generateUniqueId(), make: 'Honda', model: 'Civic', year: 2019, price: 16000, mileage: 40000, image: 'https://example.com/civic.jpg' },
      { id: 3, uniqueId: generateUniqueId(), make: 'Ford', model: 'Fusion', year: 2017, price: 14000, mileage: 60000, image: 'https://example.com/fusion.jpg' }
    ]
  },
  };

const ScrapedDataPage = () => {
  // const { url, id } = useParams();
  const { scrapeId } = useParams();
  const [scrapeData, setScrapeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCars, setSelectedCars] = useState([]);
  const [facebookPages, setFacebookPages] = useState([]);
  const [posting, setPosting] = useState(false);
  const [postSuccess, setPostSuccess] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [selectedPage, setSelectedPage] = useState('');
  const [isLoggedInToFacebook, setIsLoggedInToFacebook] = useState(false);

  // This function would be called after returning from Facebook login
  // const handleFacebookCallback = async () => {
  //   try {
  //     const response = await api.get('/facebook/callback' + window.location.search);
  //     if (response.data.success) {
  //       setFacebookPages(response.data.pages);
  //       // You might want to store the pages in localStorage or your app's state management solution
  //       localStorage.setItem('facebookPages', JSON.stringify(response.data.pages));
  //     } else {
  //       setError('Facebook login failed');
  //     }
  //   } catch (error) {
  //     console.error('Error handling Facebook callback:', error);
  //     setError('Failed to complete Facebook login');
  //   }
  // };

  useEffect(() => {
    

    // // Check if we have stored Facebook pages
    // const storedPages = localStorage.getItem('facebookPages');
    // if (storedPages) {
    //   setFacebookPages(JSON.parse(storedPages));
    // }
  }, []);

  useEffect(() => {
    // In a real application, you would fetch data from your API here
    const fetchScrapeDetails = async () => {
      try {
        const response = await api.get(`/scraping/detail/${scrapeId}`);
        if(response.data) {
          setScrapeData(response.data);
  
        }
        else {
            setScrapeData(mockScrapedData[scrapeId]);
        }
        setLoading(false);
      } catch (err) {
        setScrapeData(mockScrapedData[scrapeId]);
        // setError('Failed to fetch scrape details');
        setLoading(false);
      }
    };
    fetchScrapeDetails();

  }, [scrapeId]);

  const handleFacebookLoginSuccess = (data) => {
    setIsLoggedInToFacebook(true);
    setFacebookPages(data.pages);
    // You might want to store the user info in your app's state or context
  };

  const handleSelectCar = (carId) => {
    setSelectedCars(prev => 
      prev.includes(carId) 
        ? prev.filter(id => id !== carId)
        : [...prev, carId]
    );
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(text);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handlePostToFacebook = async () => {
    setPosting(true);
    try {
      for (const carId of selectedCars) {
        const car = scrapeData.cars.find(c => c.id === carId);
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
          console.log(`Successfully posted car ${car.uniqueId} to Facebook`);
        } else {
          console.error(`Failed to post car ${car.uniqueId} to Facebook`);
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

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-8">{error}</div>;

  const { scrapeJob, cars } = scrapeData;
  const url = scrapeJob.business.url;

  const StatusBadge = ({ status }) => {
    const colors = {
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    return (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colors[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };


  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/dashboard" className="flex items-center text-indigo-600 hover:text-indigo-800 mb-4">
        <ArrowLeft size={20} className="mr-2" />
        Back to Dashboard
      </Link>
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Scraped Data</h1>
      <p className="text-xl text-gray-600 mb-6">
        Source: <a href={decodeURIComponent(url)} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline flex items-center">
          {decodeURIComponent(url)}
          <ExternalLink size={16} className="ml-1" />
        </a>
      </p>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Post to Facebook</h2>
        {!isLoggedInToFacebook ? (
        <FacebookLogin onLoginSuccess={handleFacebookLoginSuccess} />
      ) : (
        <div>
          <select 
            value={selectedPage} 
            onChange={(e) => setSelectedPage(e.target.value)}
          >
            <option value="">Select a Page</option>
            {facebookPages.map(page => (
              <option key={page.id} value={page.id}>{page.name}</option>
            ))}
          </select>
          <button onClick={handlePostToFacebook} disabled={!selectedPage || selectedCars.length === 0}>
            Post Selected Cars to Facebook
          </button>
        </div>
      )}
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

      <div className="mb-4">
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

  {/* Scrape Job Information */}
  <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Scrape Job Information
          </h3>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Business</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{scrapeJob.business.name}</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Scraped At</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {new Date(scrapeJob.scrapedAt).toLocaleString()}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <StatusBadge status={scrapeJob.status} />
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Scrape Results Summary */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Scrape Results Summary
          </h3>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Total Cars Scraped</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{cars.length}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">New Cars Added</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                <Plus size={16} className="text-green-500 mr-1" />
                {scrapeJob.newCars}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Cars Marked as Sold</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                <Minus size={16} className="text-red-500 mr-1" />
                {scrapeJob.soldCars}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Updated Cars</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                <RefreshCw size={16} className="text-blue-500 mr-1" />
                {scrapeJob.updatedCars}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Select</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unique ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Make</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mileage</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {cars.map((car) => (
              <tr key={car.id} className={selectedCars.includes(car.id) ? 'bg-blue-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedCars.includes(car.id)}
                    onChange={() => handleSelectCar(car.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-900 mr-2">{car.uniqueId}</span>
                    <button
                      onClick={() => copyToClipboard(car.uniqueId)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {copiedId === car.uniqueId ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <img src={car.image} alt={`${car.make} ${car.model}`} className="h-16 w-24 object-cover rounded" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{car.make}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{car.model}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{car.year}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${car.price.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{car.mileage.toLocaleString()} miles</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
        {showPreview && (
            <FacebookPostPreview
                selectedCars={scrapeData.cars.filter(car => selectedCars.includes(car.id))}
                onClose={() => setShowPreview(false)}
            />
        )}
    </div>
  );
};

export default ScrapedDataPage;