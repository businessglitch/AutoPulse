const mongoose = require('mongoose');

const scrapingJobSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dealershipId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dealership', required: true },
  startedAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'completed', 'failed'], 
    default: 'pending' 
  },
  totalCars: { type: Number, default: 0 },
  newCars: { type: Number, default: 0 },
  updatedCars: { type: Number, default: 0 },
  soldCars: { type: Number, default: 0 },
  errorMessage: String
});

module.exports = mongoose.model('ScrapingJob', scrapingJobSchema);