const mongoose = require('mongoose');
const Dealership = require('../models/Dealership');
const dotenv = require('dotenv');
dotenv.config();


mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const DealershipToAdd = [
  { 
    url: 'https://www.smsmotors.ca/allcars', 
    name: 'SMS Motors',
    meta: { location: 'Vancouver' },
    active: true
  },
  
];

async function addBusinesses() {
  try {
    for (const businessData of DealershipToAdd) {
      const existingBusiness = await Dealership.findOne({ url: businessData.url });
      if (existingBusiness) {
        console.log(`Business with URL ${businessData.url} already exists. Updating...`);
        Object.assign(existingBusiness, businessData);
        await existingBusiness.save();
      } else {
        const newBusiness = new Business(businessData);
        await newBusiness.save();
        console.log(`Added new business: ${businessData.name}`);
      }
    }
  } catch (error) {
    console.error('Error adding businesses:', error);
  } finally {
    mongoose.disconnect();
  }
}

addBusinesses();