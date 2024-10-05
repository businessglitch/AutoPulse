const express = require('express');
const { performScrape } = require('../services/scrapingService');
const scrapingQueue = require('../services/queue');
const ScrapingJob = require('../models/ScrapingJob');
const Dealership = require('../models/Dealership');
const auth = require('../middleware/auth');
const router = express.Router();


router.get('/recent', auth, async (req, res) => {
  try {
    const recentScrapes = await ScrapingJob.find({ user: req.user })
      .sort({ scrapedAt: -1 })
      .limit(10); // Adjust the limit as needed
    res.json(recentScrapes);
  } catch (error) {
    console.error('Error fetching recent scrapes:', error);
    res.status(500).json({ error: 'An error occurred while fetching recent scrapes' });
  }
});

router.post('/scrape', auth, async (req, res) => {
  try {
    const { dealershipId } = req.body;
    console.log("made it to start scraping", dealershipId);
    const dealership = await Dealership.findById(dealershipId);
    
    if (!dealership) {
      return res.status(404).json({ error: 'Dealership not found' });
    }
    // Create a new scraping job in the database
    const scrapeJob = new ScrapingJob({
      user: req.user,
      dealershipId,
      status: 'pending'
    });
    await scrapeJob.save().then(() => {
      performScrape(dealership, scrapeJob);
    });


    // Add the job to the queue
    await scrapingQueue.add({ jobId: scrapeJob._id, dealership});
    res.json({ message: 'Scraping job added to queue', jobId: scrapeJob._id });
  } catch (error) {
    console.error('Error in scrape route:', error);
    res.status(500).json({ error: 'An error occurred while scraping' });
  }
});

// Get detailed data for a specific scrape
router.get('/detail/:scrapeId', auth, async (req, res) => {
  let {scrapeId} = req.params;
  console.log("scrapeId for detail", scrapeId);
  try {
    const scrapeJob = await ScrapingJob.findById(scrapeId);
    if (!scrapeJob) {
      return res.status(404).json({ error: 'Scrape job not found' });
    }

    res.json({
      scrapeJob
    });
  } catch (error) {
    console.error('Error fetching scrape details:', error);
    res.status(500).json({ error: 'An error occurred while fetching scrape details' });
  }
})

module.exports = router;