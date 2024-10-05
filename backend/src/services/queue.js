const Queue = require('bull');
const redisConfig = {
    redis: {
      port: 6379, // Redis server port
      host: '127.0.0.1', // Redis server host,
      password: '123456'
    },
  };
  

// Create a new queue
const scrapingQueue = new Queue('scraping', redisConfig);

module.exports = scrapingQueue;