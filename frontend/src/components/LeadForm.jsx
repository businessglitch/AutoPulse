import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Car, DollarSign, Calendar, Gauge } from 'lucide-react';

const LeadForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferences: {
      make: '',
      model: '',
      yearMin: '',
      yearMax: '',
      priceMin: '',
      priceMax: '',
      mileageMax: ''
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('preferences.')) {
      const prefName = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [prefName]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/leads', formData);
      console.log('Lead created:', response.data);
      alert('Thank you for your interest! We will contact you soon.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        preferences: {
          make: '',
          model: '',
          yearMin: '',
          yearMax: '',
          priceMin: '',
          priceMax: '',
          mileageMax: ''
        }
      });
    } catch (error) {
      console.error('Error creating lead:', error);
      alert('There was an error submitting your information. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-2xl">
      <motion.h2 
        className="text-3xl font-bold mb-6 text-center text-indigo-600"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Find Your Perfect Car
      </motion.h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input type="text" name="name" id="name" required
                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                     value={formData.name} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" name="email" id="email" required
                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                     value={formData.email} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
              <input type="tel" name="phone" id="phone"
                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                     value={formData.phone} onChange={handleChange} />
            </div>
          </motion.div>
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center space-x-2">
              <Car className="text-indigo-500" size={20} />
              <label htmlFor="preferences.make" className="block text-sm font-medium text-gray-700">Preferred Make</label>
            </div>
            <input type="text" name="preferences.make" id="preferences.make"
                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                   value={formData.preferences.make} onChange={handleChange} />
            <div className="flex items-center space-x-2">
              <Car className="text-indigo-500" size={20} />
              <label htmlFor="preferences.model" className="block text-sm font-medium text-gray-700">Preferred Model</label>
            </div>
            <input type="text" name="preferences.model" id="preferences.model"
                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                   value={formData.preferences.model} onChange={handleChange} />
          </motion.div>
        </div>
        <motion.div 
          className="grid md:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Calendar className="text-indigo-500" size={20} />
              <label className="block text-sm font-medium text-gray-700">Year Range</label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input type="number" name="preferences.yearMin" placeholder="Min Year"
                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                     value={formData.preferences.yearMin} onChange={handleChange} />
              <input type="number" name="preferences.yearMax" placeholder="Max Year"
                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                     value={formData.preferences.yearMax} onChange={handleChange} />
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="text-indigo-500" size={20} />
              <label className="block text-sm font-medium text-gray-700">Price Range</label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input type="number" name="preferences.priceMin" placeholder="Min Price"
                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                     value={formData.preferences.priceMin} onChange={handleChange} />
              <input type="number" name="preferences.priceMax" placeholder="Max Price"
                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                     value={formData.preferences.priceMax} onChange={handleChange} />
            </div>
          </div>
        </motion.div>
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <div className="flex items-center space-x-2">
            <Gauge className="text-indigo-500" size={20} />
            <label htmlFor="preferences.mileageMax" className="block text-sm font-medium text-gray-700">Max Mileage</label>
          </div>
          <input type="number" name="preferences.mileageMax" id="preferences.mileageMax"
                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                 value={formData.preferences.mileageMax} onChange={handleChange} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out transform hover:scale-105">
            Find My Perfect Car
          </button>
        </motion.div>
      </form>
    </div>
  );
};

export default LeadForm;