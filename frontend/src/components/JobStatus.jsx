import React, { useState, useEffect } from 'react';
import axios from 'axios';

const JobStatus = ({ jobId }) => {
  const [job, setJob] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(`/api/scraping/job/${jobId}`);
        setJob(response.data);
      } catch (err) {
        setError('Failed to fetch job status');
      }
    };

    fetchJob();
    const intervalId = setInterval(fetchJob, 5000); // Poll every 5 seconds

    return () => clearInterval(intervalId);
  }, [jobId]);

  if (error) return <div className="text-red-500">{error}</div>;
  if (!job) return <div>Loading...</div>;

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-xl font-bold mb-4">Job Status: {job.status}</h2>
      {job.status === 'completed' && (
        <div>
          <p>Scraped {job.result.length} cars</p>
          {/* You can add more details or a link to view the scraped data */}
        </div>
      )}
      {job.status === 'failed' && <p className="text-red-500">Error: {job.error}</p>}
    </div>
  );
};

export default JobStatus;