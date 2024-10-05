const Queue = require('bull');

// Create a new queue
const scrapingQueue = new Queue('scraping', process.env.REDIS_URL);

module.exports = scrapingQueue;