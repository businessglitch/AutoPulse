import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LeadManagement = () => {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await axios.get('/api/leads');
        setLeads(response.data);
      } catch (error) {
        console.error('Error fetching leads:', error);
      }
    };

    fetchLeads();
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Lead Management</h2>
      {leads.map(lead => (
        <div key={lead._id} className="border p-4 rounded-md">
          <h3 className="font-semibold">{lead.name}</h3>
          <p>{lead.email}</p>
          <p>Status: {lead.status}</p>
          <h4 className="font-semibold mt-2">Matched Cars:</h4>
          <ul className="list-disc pl-5">
            {lead.matchedCars.map(car => (
              <li key={car._id}>{car.year} {car.make} {car.model}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default LeadManagement;