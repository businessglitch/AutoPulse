const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  preferences: {
    make: [String],
    model: [String],
    yearMin: Number,
    yearMax: Number,
    priceMin: Number,
    priceMax: Number,
    mileageMax: Number,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  matchedCars: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Car' }],
  status: { type: String, enum: ['new', 'contacted', 'qualified', 'lost', 'converted'], default: 'new' }
});

module.exports = mongoose.model('Lead', leadSchema);