const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { scrapeCarsForBusiness } = require('./services/scrapingService');
// Routes
const authRoutes = require('./routes/auth');
const scrapingRoutes = require('./routes/scraping');
const businessRoutes = require('./routes/business');
const leadRoutes = require('./routes/leads');
const facebookRoutes = require('./routes/facebook');

dotenv.config();

const startScrape = async () => {
    url = "https://www.smsmotors.ca/allcars";
    console.log("at server starting scrape");
    const response  = await scrapeCarsForBusiness(url);
}

// startScrape();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Could not connect to MongoDB', err));

app.use('/api/auth', authRoutes);
app.use('/api/scraping', scrapingRoutes);
app.use('/api/businesses', businessRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/facebook',facebookRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));