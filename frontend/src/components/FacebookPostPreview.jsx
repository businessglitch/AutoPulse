import React from 'react';
import { X } from 'lucide-react';

const FacebookPostPreview = ({ selectedCars, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Facebook Post Preview</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <div className="p-4">
          <div className="bg-gray-100 rounded-lg p-4 mb-4">
            <p className="font-semibold mb-2">Check out these great deals!</p>
            {selectedCars.map((car, index) => (
              <div key={car.id} className="mb-2 last:mb-0">
                <p>{car.year} {car.make} {car.model} - ${car.price.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Unique ID: {car.uniqueId}</p>
                <img src={car.image} alt={`${car.make} ${car.model}`} className="mt-2 rounded-md w-full" />
                {index < selectedCars.length - 1 && <hr className="my-2 border-gray-300" />}
              </div>
            ))}
            <p className="mt-4 text-sm text-gray-600">
              Interested? Contact us and mention the Unique ID for quick assistance!
            </p>
          </div>
          <p className="text-sm text-gray-500">This is a preview of how your post will appear on Facebook. The actual post may vary slightly.</p>
        </div>
      </div>
    </div>
  );
};

export default FacebookPostPreview;