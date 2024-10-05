const express = require('express');
const auth = require('../middleware/auth');
const Car = require('../models/Car');
const router = express.Router();



// Get detailed data for a specific scrape
router.get('/:dealershipId', auth, async (req, res) => {
    let {dealershipId} = req.params;

    console.log("Invetory details for: ", dealershipId);
    try {
        const allBusinessCars = await Car.find({ dealership: dealershipId, status: 'available' });

      res.json(allBusinessCars);
    } catch (error) {
      console.error('Error fetching business inventory:', error);
      res.status(500).json({ error: 'An error occurred while fetching inventory for business' });
    }
  })

  module.exports = router;