import React, { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Car, DollarSign, BarChart2, Plus, RefreshCw,ExternalLink, Link as LinkIcon } from 'lucide-react';
import { scrapeWebsite } from '../services/scrape';
import JobStatus from './JobStatus';
import RecentScrapes from './RecentScrapes';
import AddBusiness from './AddBusiness';
import Modal from './Modal';
import api from '../services/api';


// Mock data for demonstration
const recentActivity = [
  { id: 1, action: 'New listing added', car: '2018 Toyota Camry', time: '2 hours ago' },
  { id: 2, action: 'Price updated', car: '2019 Honda Civic', time: '5 hours ago' },
  { id: 3, action: 'Listing removed', car: '2017 Ford Fusion', time: '1 day ago' },
];

const recentScrapedSites = [
  { id: 1, url: 'https://example-cars.com', carsScraped: 45, time: '1 day ago' },
  { id: 2, url: 'https://anothercarsite.com', carsScraped: 32, time: '3 days ago' },
];

const Dashboard = () => {
  const [scrapingUrl, setScrapingUrl] = useState('');
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


  const handleAddBusiness = (newBusiness) => {
    setBusinesses([...businesses, newBusiness]);
    setIsModalOpen(false);
  };

  const fetchBusinesses = async () => {
    try {
        const response = await api.get('/businesses');
        setBusinesses(response.data);
    } catch (err) {
      console.error('Error fetching businesses:', err);
      setError('Failed to fetch businesses');
    }
  };

  useEffect(() => {
    

    fetchBusinesses();
  }, []);

  const handleScrapeSubmit = async (e) => {
    e.preventDefault();
    // Here you would typically call an API to start the scraping process
    
    if (!selectedBusiness) {
        setError('Please select a business to scrape');
        return;
      }
  
      setIsLoading(true);
      setError(null);

    try {
        const response = await api.post('/scraping/scrape', { dealershipId: selectedBusiness });
        console.log('Scrape result:', response.data);
        setJobId(response.data.jobId);
      } catch (err) {
        setError('Failed to start scraping job');
      }
      finally {
        setIsLoading(false);
      }

  };

  return (
    <div className="container mx-auto px-4 py-8">
     <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Add New Business
        </button>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <SummaryCard title="Total Listings" value="124" icon={Car} color="bg-blue-500" />
        <SummaryCard title="Total Value" value="$1,240,000" icon={DollarSign} color="bg-green-500" />
        <SummaryCard title="Avg. Listing Age" value="15 days" icon={BarChart2} color="bg-yellow-500" />
        <SummaryCard title="Sold This Month" value="8" icon={DollarSign} color="bg-purple-500" />
      </div>
      
      {/* URL Scraper Section */}
      <div className="mb-8">
        <label htmlFor="business-select" className="block text-sm font-medium text-gray-700 mb-2">
          Select a business to scrape
        </label>
        <div className="flex">
          <select
            id="business-select"
            value={selectedBusiness}
            onChange={(e) => setSelectedBusiness(e.target.value)}
            className="flex-grow shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          >
            <option value="">Select a business</option>
            {businesses.map((business) => (
              <option key={business._id} value={business._id}>
                {business.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleScrapeSubmit}
            disabled={isLoading || !selectedBusiness}
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? 'Scraping...' : 'Scrape'}
          </button>
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>
      <RecentScrapes />
      
      {/* Quick Actions */}
      {/* <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Quick Actions</h2>
        <div className="flex space-x-4">
          <QuickActionButton text="Add New Listing" icon={Plus} />
          <QuickActionButton text="Refresh Listings" icon={RefreshCw} />
        </div>
      </div> */}
      
      {/* Recent Activity */}
      {/* <div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Recent Activity</h2>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="px-6 py-4 border-b last:border-b-0">
              <p className="text-sm text-gray-600">{activity.time}</p>
              <p className="text-gray-800">{activity.action}: <span className="font-semibold">{activity.car}</span></p>
            </div>
          ))}
        </div>
      </div> */}

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <AddBusiness onBusinessAdded={handleAddBusiness} />
        </Modal>
    </div>
  );
};

const SummaryCard = ({ title, value, icon: Icon, color }) => (
  <div className={`${color} rounded-lg shadow-md p-6 text-white`}>
    <div className="flex justify-between items-center">
      <div>
        <p className="text-sm uppercase">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
      <Icon size={24} />
    </div>
  </div>
);

const QuickActionButton = ({ text, icon: Icon }) => (
  <button className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-300">
    <Icon size={18} className="mr-2" />
    {text}
  </button>
);

export default Dashboard;