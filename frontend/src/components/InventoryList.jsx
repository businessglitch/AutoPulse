import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Check, Copy } from 'lucide-react';

const InventoryList = ({ cars, handleSelectCar, selectedCars }) => {
  //const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
//   const [selectedCars, setSelectedCars] = useState([]);

  
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(text);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };


//   useEffect(() => {
//     const fetchInventory = async () => {
//       try {
//         const response = await api.get(`/inventory/${dealershipId}`);
//         setCars(response.data);
//         setLoading(false);
//       } catch (err) {
//         setError('Failed to fetch inventory');
//         setLoading(false);
//       }
//     };

//     fetchInventory();
//   }, [dealershipId]);

//   if (loading) return <div>Loading inventory...</div>;
//   if (error) return <div>{error}</div>;

  return (
    <div className=" shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Select</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vin</th>
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
              <tr key={car.vin} className={selectedCars.includes(car.id) ? 'bg-blue-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedCars.includes(car._id)}
                    onChange={() => handleSelectCar(car._id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-900 mr-2">{car.vin}</span>
                    <button
                      onClick={() => copyToClipboard(car.uniqueId)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {copiedId === car.vin ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
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
  );
};

export default InventoryList;