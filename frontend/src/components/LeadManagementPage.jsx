import React from 'react';
import LeadManagement from '../components/LeadManagement';

const LeadManagementPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Lead Management</h1>
      <LeadManagement />
    </div>
  );
};

export default LeadManagementPage;