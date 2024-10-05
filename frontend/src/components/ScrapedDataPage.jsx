import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import FacebookPostPreview from './FacebookPostPreview';
import { ArrowLeft, ExternalLink, Facebook, Check, X, Copy, Plus, Minus, RefreshCw } from 'lucide-react';
import api from '../services/api';
import FacebookLogin from './FacebookLogin';


const ScrapedDataPage = () => {
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

  useEffect(() => {
    const fetchScrapeDetails = async () => {
      try {
        const response = await api.get(`/scraping/detail/${scrapeId}`);
        const { scrapeJob } = response.data;
        setScrapeData(scrapeJob);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch scrape details');
        setLoading(false);
      }
    };
    fetchScrapeDetails();

  }, [scrapeId]);

  
  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-8">{error}</div>;

  const url ="business url";

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
      <p className="text-xl text-gray-600 mb-6 flex flex-inline gap-6">
        Source: <a href={decodeURIComponent(url)} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline flex items-center">
          {decodeURIComponent(url)}
          <ExternalLink size={16} className="ml-1" />
        </a>
      </p>

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
              {/* <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{scrapeJob.business.name}</dd> */}
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Scraped At</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {new Date(scrapeData.startedAt).toLocaleString()}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <StatusBadge status={scrapeData.status} />
              </dd>
            </div>
            {(scrapeData.status === "failed") ? (
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Error Message</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <StatusBadge status={scrapeData.errorMessage} />
              </dd>
            </div>) : ""}
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
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{scrapeData.totalCars}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">New Cars Added</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                <Plus size={16} className="text-green-500 mr-1" />
                {scrapeData.newCars}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Cars Marked as Sold</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                <Minus size={16} className="text-red-500 mr-1" />
                {scrapeData.soldCars}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Updated Cars</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                <RefreshCw size={16} className="text-blue-500 mr-1" />
                {scrapeData.updatedCars}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default ScrapedDataPage;