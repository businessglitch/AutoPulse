const websiteConfigs = require('../configs/websiteConfigs');
const url = require('url');
const Dealership = require('../models/Dealership');
const Car = require('../models/Car');

const puppeteer = require('puppeteer');

// Custom delay function
const delay = (time) => new Promise(function (resolve) {
	setTimeout(resolve, time)
});

const performScrape = async (dealership, scrapeJob) => {
	console.log("starting async scrape", scrapeJob, dealership);
	  try {
		 // Perform the actual scraping
		 const scrapedData = await scrapeWebsite(dealership.url);  // Implement this function based on your scraping logic
		// Process the scraped data
		console.log("scraped cars data, now processing cars")
		let newCars = 0;
		let updatedCars = 0;
		let soldCars = 0;

		// Update or insert scraped cars
		for (const carData of scrapedData) {
			if (carData.vin === 'N/A') continue;
			const existingCar = await Car.findOne({ dealership: dealership._id, vin: carData.vin });
			console.log("existingCar", existingCar)
			if (!existingCar) {
				// Insert new car
				console.log("creating new car", carData.vin, dealership._id)
				await Car.create({
					...carData,
					dealership: dealership._id,
					first_seen: new Date(),
					last_seen: new Date(),
					status: 'available'
				});
				newCars++;
			} else if (carData.price !== existingCar.price || carData.mileage !== existingCar.mileage) {
				console.log("updating existing car", carData.vin)
				await Car.findByIdAndUpdate(existingCar._id, {
					...carData,
					last_seen: new Date(),
					status: 'available' // In case it was marked as sold before
				});
				updatedCars++;
			}

		}	
		console.log("processed all the new and updated cars");
		// Check for sold cars (cars in DB not in scraped data)
		const allBusinessCars = await Car.find({ dealership: dealership._id, status: 'available' });
		const scrapedIds = scrapedData.map(car => car.vin);

		for (const car of allBusinessCars) {
		  if (!scrapedIds.includes(car.vin)) {
			await Car.findByIdAndUpdate(car._id, { status: 'sold' });
			soldCars++;
		  }
		}
	
		// Update the scrape job
		scrapeJob.status = 'completed';
		scrapeJob.completedAt = new Date();
		scrapeJob.totalCars = scrapedData.length;
		scrapeJob.newCars = newCars;
		scrapeJob.updatedCars = updatedCars;
		scrapeJob.soldCars = soldCars;
		await scrapeJob.save();
	
		return scrapeJob;
	  }
	  catch(error) {
		scrapeJob.status = 'failed';
		scrapeJob.errorMessage = error.message;
		await scrapeJob.save();
		throw error;
	}
}

const scrapeWebsite = async (dealershipUrl, meta = {}) => {
	let browser;
	try {
		// Extract the hostname from the URL
		const hostname = new url.URL(dealershipUrl).hostname.replace('www.', '');

		// First, save or update the business
		//let dealership = await Dealership.findByIdAndUpdate(dealershipId, { scraped_at:new Date()});

		browser = await puppeteer.launch({
			headless: true,
			args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
			defaultViewport: null,
		});

		const page = await browser.newPage();


		// Get the configuration for this website
		const config = websiteConfigs[hostname];
		// Set a longer timeout for navigation
		await page.setDefaultNavigationTimeout(60000); // 60 seconds
		await page.goto(dealershipUrl, { waitUntil: 'networkidle0' });

		// Wait for a selector that's likely to be present on car listing pages
		console.log('Waiting for div selector');
		// Wait for the car listings to load
		await page.waitForSelector(config.listingSelector, { timeout: 40000 });
		console.log('Div selector found');


		// Scroll the page to ensure all content is loaded
		console.log('Starting page scroll');
		await autoScroll(page);
		console.log('Page scroll completed');

		// Wait an additional 5 seconds for any delayed content to load
		console.log('Waiting additional 5 seconds for content to load');
		await delay(5000);

		console.log('Starting car data extraction');


		const scrapedCars = await page.evaluate((config) => {
			console.log('Inside page.evaluate');
			const carElements = document.querySelectorAll(config.listingSelector);
			console.log('Found', carElements.length, 'potential car elements');

			return Array.from(carElements).map(el => {
				const titleElement = el.querySelector(config.detailsSelectors.title);
				const priceElement = el.querySelector('[data-cg-price]');
				const mileageElement = el.querySelector(config.detailsSelectors.mileage);
				const imageElement = el.querySelector(config.detailsSelectors.imageUrl);
				const linkElement = el.querySelector(config.detailsSelectors.detailsUrl);
				const vinElement = el.querySelector('[data-cg-vin]');

				const title = titleElement.innerText.trim();
				const year = title.split(" ")[0];
				const make = title.split(" ")[1];
				const model = title.split(" ")[2];

				// Find Carfax link
				let carfaxLink = null;
				const carfaxDiv = el.querySelector('.carfax_inventory');
				if (carfaxDiv) {
					const carfaxAnchor = carfaxDiv.querySelector('a');
					if (carfaxAnchor) {
						carfaxLink = carfaxAnchor.href;
					}
				}

				return {
					title: titleElement ? title : 'N/A',
					year: year,
					make: make,
					model: model,
					price: priceElement ? priceElement.getAttribute('data-cg-price') : 'N/A',
					mileage: mileageElement ? mileageElement.innerText.trim() : 'N/A',
					imageUrl: imageElement ? imageElement.src : null,
					detailsUrl: linkElement ? linkElement.href : null,
					vin: vinElement ? vinElement.getAttribute('data-cg-vin') : 'N/A',
					carfaxLink: carfaxLink
				};
			});
		}, config);

		if (scrapedCars.length === 0) {
			console.log('No car listings found. HTML content:', await page.content());
			throw new Error('No car listings found on the page. The selector might need to be updated.');
		}

		return scrapedCars;

		// Get all current cars for this business
		const currentCars = await Car.find({ dealership: dealership._id, status: 'available' });

		const scrapedVINs = new Set(scrapedCars.map(car => car.vin));
		const currentVINs = new Set(currentCars.map(car => car.vin));

		// Update or insert scraped cars
		for (const carData of scrapedCars) {
			if (carData.vin === 'N/A') continue;

			const existingCar = await Car.findOne({ dealership: dealership._id, vin: carData.vin });

			if (existingCar) {
				// Update existing car
				existingCar.set({
					...carData,
					last_seen: new Date(),
					status: 'available' // In case it was marked as sold before
				});
				await existingCar.save();
			} else {
				// Insert new car
				await Car.create({
					...carData,
					dealership: dealership._id,
					first_seen: new Date(),
					last_seen: new Date(),
					status: 'available'
				});
			}
		}

		// Mark cars as sold if they're no longer in the scraped data
		const soldCars = currentCars.filter(car => !scrapedVINs.has(car.vin));
		for (const soldCar of soldCars) {
			soldCar.status = 'sold';
			soldCar.sold_date = new Date();
			await soldCar.save();
		}

		// Calculate statistics
		const newCars = scrapedCars.filter(car => !currentVINs.has(car.vin));
		const updatedCars = scrapedCars.filter(car => currentVINs.has(car.vin));
		console.log("totalScraped", scrapedCars.length)
		console.log("newCars", newCars.length)
		console.log("updatedCars", updatedCars.length)
		console.log("soldCars", soldCars.length)
		return {
			totalScraped: scrapedCars.length,
			newCars: newCars.length,
			updatedCars: updatedCars.length,
			soldCars: soldCars.length
		};

	} catch (error) {
		console.error('Error scraping cars:', error);
		throw error;
	} finally {
		if (browser) {
			await browser.close();
		}
	}
};

// Helper function to scroll the page
async function autoScroll(page) {
	console.log('Starting autoScroll function');
	await page.evaluate(async () => {
		await new Promise((resolve) => {
			let totalHeight = 0;
			const distance = 100;
			const timer = setInterval(() => {
				const scrollHeight = document.body.scrollHeight;
				window.scrollBy(0, distance);
				totalHeight += distance;

				if (totalHeight >= scrollHeight) {
					clearInterval(timer);
					console.log('Finished scrolling');
					resolve();
				}
			}, 100);
		});
	});
	console.log('Finished autoScroll function');
}

module.exports = { performScrape };