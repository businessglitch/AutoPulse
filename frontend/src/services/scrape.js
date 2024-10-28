import api from './api';

export const scrapeWebsite = async (url) => {
    const response = await api.fetch(`/scraping/scrape`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${localStorage.getItem('token')}` // If you're using token authentication
    },
    body: JSON.stringify({ url })
    });

    console.log("response", response);

    if (!response.ok) {
        throw new Error('Scraping failed');
    }

    const data = await response.json();
    return data.cars;
  };