const scrapingQueue = require('../services/queue');
const ScrapingJob = require('../models/ScrapingJob');
const { performScrape } = require('../services/scrapingService');
const RecentScrape = require('../models/RecentScrape');

// Event listener for completed jobs
scrapingQueue.on('completed', (job, result) => {
  console.log(`Job ID ${job.id} completed with result:`, result);
});

// Event listener for failed jobs
scrapingQueue.on('failed', (job, err) => {
  console.error(`Job ID ${job.id} failed with error:`, err);
});

scrapingQueue.process(async (job) => {
  console.log("Started processing Job", jobId, dealership)

  const { jobId, dealership } = job.data;

  try {
    // Update job status to processing
    await ScrapingJob.findByIdAndUpdate(jobId, { status: 'processing' });

    // Perform scraping
    const scrapeResult = await performScrape(dealership);

    // Update job with results
    await ScrapingJob.findByIdAndUpdate(jobId, {
      status: 'completed',
      result: scrapedData,
      totalScraped: scrapeResult.totalScraped,
      newCars: scrapeResult.newCars,
      updatedCars: scrapeResult.updatedCars,
      soldCars: scrapeResult.soldCars,
      updatedAt: new Date()
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