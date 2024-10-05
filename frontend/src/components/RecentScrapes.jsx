import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { CheckCircle, XCircle, AlertCircle,ExternalLink } from 'lucide-react';

const StatusIcon = ({ status }) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="text-green-500" />;
    case 'failed':
      return <XCircle className="text-red-500" />;
    default:
      return <AlertCircle className="text-yellow-500" />;
  }
};

const RecentScrapes = () => {
    const recentScrapedSites = [
        { _id: 1, url: 'https://example-cars.com', carsScraped: 45, scrapedAt: '1 day ago', status:"pending", business:{name: "Sms Motors", url: 'https://anothercarsite.com'} },
        { _id: 2, url: 'https://anothercarsite.com', carsScraped: 32, scrapedAt: '3 days ago', status:"failed",  business:{name: "Sms Motors", url: 'https://anothercarsite.com'}},
      ];

      
  const [recentScrapes, setRecentScrapes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentScrapes = async () => {
      try {
        const response = await api.get('/scraping/recent');
        if(response.data.length > 1) {
          setRecentScrapes(response.data);

        } else {
          setRecentScrapes(recentScrapedSites);

        }
      } catch (err) {
        setError('Failed to fetch recent scrapes');
      }
    };

    fetchRecentScrapes();
  }, []);

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Recent Scrapes</h2>
      </div>
      {recentScrapes.length === 0 ? (
        <p className="p-6 text-gray-600">No recent scrapes found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scraped At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Scraped</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentScrapes.map((scrape) => (
                <tr key={scrape._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <StatusIcon status={scrape.status} />
                      <span className="ml-2 text-sm font-medium text-gray-900">
                        {scrape.status.charAt(0).toUpperCase() + scrape.status.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{scrape.business.name}</div>
                    <div className="text-sm text-gray-500">{scrape.business.url}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(scrape.scrapedAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {scrape.totalScraped}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link 
                      to={`/scraped-job-details/${scrape._id}`} 
                      className="text-indigo-600 hover:text-indigo-900 flex items-center"
                    >
                      View Details
                      <ExternalLink size={16} className="ml-1" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecentScrapes;