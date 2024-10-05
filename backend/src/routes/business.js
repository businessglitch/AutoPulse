const express = require('express');
const Dealership = require('../models/Dealership');
const auth = require('../middleware/auth');


const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const dealerships = await Dealership.find({ user: req.user, active:true }).select('name url');
    res.json(dealerships);
  } catch (error) {
    console.error('Error fetching dealerships:', error);
    res.status(500).json({ error: 'An error occurred while fetching dealerships' });
  }
});

// Add a new business
router.post('/', auth, async (req, res) => {

  if (!req.user) {
    console.log('User not found in request. Auth middleware may not be working correctly.');
    return res.status(400).json({ error: 'User ID is missing' });
  }

  try {
    const { name, url, meta } = req.body;
    const newBusiness = new Dealership({
      name,
      url,
      user: req.user,
      meta
    });

    await newBusiness.save();
    res.status(201).json(newBusiness);
  } catch (error) {
    console.error('Error adding business:', error);
    res.status(500).json({ error: 'An error occurred while adding the business' });
  }
});

module.exports = router;