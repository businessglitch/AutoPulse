const express = require('express');
const { scrapeCars } = require('../services/scrapingService');
const scrapingQueue = require('../services/queue');
const ScrapingJob = require('../models/ScrapingJob');
const RecentScrape = require('../models/RecentScrape');
const Dealership = require('../models/Dealership');
const auth = require('../middleware/auth');


const router = express.Router();


router.get('/recent', auth, async (req, res) => {
  try {
    const recentScrapes = await RecentScrape.find({ userId: req.user._id })
      .sort({ scrapedAt: -1 })
      .limit(10); // Adjust the limit as needed
    res.json(recentScrapes);
  } catch (error) {
    console.error('Error fetching recent scrapes:', error);
    res.status(500).json({ error: 'An error occurred while fetching recent scrapes' });
  }
});

router.post('/scrape', async (req, res) => {
  try {
    const { dealershipId } = req.body;
    const dealership = await Dealership.findById(businessId);
    if (!business) {
      return res.status(404).json({ error: 'Dealership not found' });
    }


      // Create a new scraping job in the database
      const job = new ScrapingJob({ dealershipId, url: dealership.url });
      await job.save();
  
      // Add the job to the queue
      await scrapingQueue.add({ jobId: job._id, dealershipId, url: dealership.url});
  
      res.json({ message: 'Scraping job added to queue', jobId: job._id });

    // const cars = await scrapeCars(url);
    // res.json({ cars });
  } catch (error) {
    console.error('Error in scrape route:', error);
    res.status(500).json({ error: 'An error occurred while scraping' });
  }
});

// Get detailed data for a specific scrape
router.get('/detail/:scrapeId', auth, async (req, res) => {
  let {scrapeId} = req.params;
  scrapeId = "66fec00e66119b221af26a47";
  console.log("scrapeId", scrapeId);
  try {
    const scrapeJob = await ScrapingJob.findById(scrapeId);
    if (!scrapeJob) {
      return res.status(404).json({ error: 'Scrape job not found' });
    }

    res.json({
      scrapeJob: {
        ...scrapeJob.toObject(),
        newCars: 1,
        soldCars: 1,
        updatedCars: 1
      },
      cars: []
    });
    return;

    const cars = await Car.find({ scrapeJob: req.params.scrapeId });
    // Add status flags to each car
    const carsWithStatus = cars.map(car => ({
      ...car.toObject(),
      isNew: car.createdAt.getTime() === scrapeJob.scrapedAt.getTime(),
      isSold: car.status === 'sold',
      isUpdated: car.updatedAt > car.createdAt && car.updatedAt.getTime() === scrapeJob.scrapedAt.getTime()
    }));

    res.json({
      scrapeJob: {
        ...scrapeJob.toObject(),
        newCars: carsWithStatus.filter(car => car.isNew).length,
        soldCars: carsWithStatus.filter(car => car.isSold).length,
        updatedCars: carsWithStatus.filter(car => car.isUpdated).length
      },
      cars: carsWithStatus
    });
    
    // res.json({
    //   scrapeJob,
    //   cars
    // });
  } catch (error) {
    console.error('Error fetching scrape details:', error);
    res.status(500).json({ error: 'An error occurred while fetching scrape details' });
  }
})

module.exports = router;