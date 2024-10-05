import React, { useState } from 'react';
import api from '../services/api';


const AddBusiness = () => {
  const [businessData, setBusinessData] = useState({
    name: '',
    url: '',
    meta: {
      location: '',
      phoneNumber: '',
      businessType: ''
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('meta.')) {
      const metaField = name.split('.')[1];
      setBusinessData(prevState => ({
        ...prevState,
        meta: {
          ...prevState.meta,
          [metaField]: value
        }
      }));
    } else {
      setBusinessData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/businesses', businessData);
      console.log('Business added:', response.data);
      // Clear form after successful submission
      setBusinessData({
        name: '',
        url: '',
        meta: {
          location: '',
          phoneNumber: '',
          businessType: ''
        }
      });
      // You might want to add some user feedback here, like a success message
    } catch (error) {
      console.error('Error adding business:', error);
      // Handle errors, maybe show an error message to the user
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-5">Add New Business</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Business Name</label>
          <input
            type="text"
            name="name"
            id="name"
            required
            value={businessData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700">Business URL</label>
          <input
            type="url"
            name="url"
            id="url"
            required
            value={businessData.url}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="meta.location" className="block text-sm font-medium text-gray-700">Location</label>
          <input
            type="text"
            name="meta.location"
            id="meta.location"
            value={businessData.meta.location}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="meta.phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="tel"
            name="meta.phoneNumber"
            id="meta.phoneNumber"
            value={businessData.meta.phoneNumber}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="meta.businessType" className="block text-sm font-medium text-gray-700">Business Type</label>
          <input
            type="text"
            name="meta.businessType"
            id="meta.businessType"
            value={businessData.meta.businessType}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Business
        </button>
      </form>
    </div>
  );
};

export default AddBusiness;