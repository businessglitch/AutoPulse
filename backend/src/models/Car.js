const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  dealership: { type: mongoose.Schema.Types.ObjectId, ref: 'Dealership', required: true },
  title: String,
  year: String,
  make: String,
  model: String,
  price: String,
  mileage: String,
  imageUrl: String,
  detailsUrl: String,
  vin: { type: String, required: true, index: true },  // Updated
  carfaxLink: String,
  scraped_at: { type: Date, default: Date.now },
  status: { type: String, enum: ['available', 'sold'], default: 'available' },
  first_seen: { type: Date, default: Date.now },
  last_seen: { type: Date, default: Date.now },
  sold_date: Date
});

module.exports = mongoose.model('Car', carSchema);