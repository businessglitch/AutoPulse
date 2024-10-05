const mongoose = require('mongoose');

const DealershipSchema = new mongoose.Schema({
  url: { type: String, required: true, unique: true },
  name: String,
  scraped_at: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  meta: mongoose.Schema.Types.Mixed,
  active: { type: Boolean, default: true } // Whether this business should be scraped
});

module.exports = mongoose.model('Dealership', DealershipSchema);