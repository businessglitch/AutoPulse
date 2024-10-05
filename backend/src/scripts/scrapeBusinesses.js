const mongoose = require('mongoose');
const { scrapeCarsForBusiness } = require('../services/scrapingService');
const Dealership = require('../models/Dealership');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function scrapeAll() {
  try {
    // Fetch all active businesses from the database
    const businessesToScrape = await Dealership.find({ active: true });

    if (businessesToScrape.length === 0) {
      console.log('No active businesses found to scrape.');
      return;
    }

    for (const business of businessesToScrape) {
      console.log(`Scraping ${business.url}...`);
      try {
        const result = await scrapeCarsForBusiness(business.url, business.meta);
        console.log(`Scrape results for ${business.name || business.url}:`);
        console.log(`Total cars scraped: ${result.totalScraped}`);
        console.log(`New cars: ${result.newCars}`);
        console.log(`Updated cars: ${result.updatedCars}`);
        console.log(`Cars marked as sold: ${result.soldCars}`);

        // Update the last scraped time
        business.scraped_at = new Date();
        await business.save();
      } catch (error) {
        console.error(`Error scraping ${business.name || business.url}:`, error);
      }
    }
  } catch (error) {
    console.error('Error fetching businesses from database:', error);
  } finally {
    mongoose.disconnect();
  }
}

scrapeAll();