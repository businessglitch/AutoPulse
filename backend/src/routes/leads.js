const express = require('express');
const Lead = require('../models/Lead');
const Car = require('../models/Car');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const lead = new Lead(req.body);
    await lead.save();
    
    // Match cars immediately after lead creation
    const matchedCars = await matchCarsForLead(lead);
    lead.matchedCars = matchedCars.map(car => car._id);
    await lead.save();

    res.status(201).json(lead);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const leads = await Lead.find().populate('matchedCars');
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

async function matchCarsForLead(lead) {
  const query = {
    make: { $in: lead.preferences.make },
    model: { $in: lead.preferences.model },
    year: { 
      $gte: lead.preferences.yearMin || 0, 
      $lte: lead.preferences.yearMax || new Date().getFullYear() 
    },
    price: { 
      $gte: lead.preferences.priceMin || 0, 
      $lte: lead.preferences.priceMax || Number.MAX_SAFE_INTEGER 
    },
    mileage: { $lte: lead.preferences.mileageMax || Number.MAX_SAFE_INTEGER }
  };

  return await Car.find(query).limit(10);  // Limit to top 10 matches
}

module.exports = router;