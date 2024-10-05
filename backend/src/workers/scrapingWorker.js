const scrapingQueue = require('../services/queue');
const ScrapingJob = require('../models/ScrapingJob');
const { scrapeCarsForBusiness } = require('../services/scrapingService');
const RecentScrape = require('../models/RecentScrape');


scrapingQueue.process(async (job) => {
    const { jobId, url, , dealershipId } = job.data;
  
  try {

    
     // Create a pending RecentScrape entry
     const recentScrape = await RecentScrape.create({
        url,
        status: 'pending',
        userId
      });
      
    // Update job status to processing
    await ScrapingJob.findByIdAndUpdate(jobId, { status: 'processing' });

    // Perform scraping
    const scrapeResult = await scrapeCarsForBusiness(business.url);

    // Update job with results
    await ScrapingJob.findByIdAndUpdate(jobId, {
      status: 'completed',
      result: scrapedData,
      updatedAt: new Date()
    });

        // Update the RecentScrape entry
        await RecentScrape.findByIdAndUpdate(recentScrape._id, {
        business: businessId,
        totalScraped: scrapeResult.totalScraped,
        newCars: scrapeResult.newCars,
        updatedCars: scrapeResult.updatedCars,
        soldCars: scrapeResult.soldCars,
        status: 'completed'
        });

    return scrapeResult;
  } catch (error) {
    console.error(`Error processing job ${jobId}:`, error);
    
    
    // Update job with error information
    await ScrapingJob.findByIdAndUpdate(jobId, {
        status: 'failed',
        error: error.message,
        updatedAt: new Date()
      });
  
      // Update the RecentScrape entry with error information
      await RecentScrape.findOneAndUpdate(recentScrape._id,{
          status: 'failed',
          errorMessage: error.message
        }
      );

    throw error;
  }
});