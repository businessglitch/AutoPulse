const mongoose = require('mongoose');

const recentScrapeSchema = new mongoose.Schema({
    business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
    scrapedAt: { type: Date, default: Date.now },
    totalScraped: { type: Number, default: 0 },
    newCars: { type: Number, default: 0 },
    updatedCars: { type: Number, default: 0 },
    soldCars: { type: Number, default: 0 },
    status: { type: String, enum: ['pending', 'completed', 'failed'], required: true },
    error: String
});

module.exports = mongoose.model('RecentScrape', recentScrapeSchema);