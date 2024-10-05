const mongoose = require('mongoose');

const scrapingJobSchema = new mongoose.Schema({
  dealershipId: { type: String, required: true },
  status: { type: String, enum: ['pending', 'processing', 'completed', 'failed'], default: 'pending' },
  result: { type: mongoose.Schema.Types.Mixed },
  error: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ScrapingJob', scrapingJobSchema);