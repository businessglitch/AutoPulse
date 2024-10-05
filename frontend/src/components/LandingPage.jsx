import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Car, Database, Facebook, ChevronRight, ClipboardList } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
    <Icon className="w-12 h-12 text-indigo-500 mb-4" />
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default function LandingPage() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle email submission here
    console.log('Email submitted:', email);
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "AutoPulse",
    "applicationCategory": "BusinessApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "AutoPulse is a powerful SAAS tool for scraping, managing, and posting used car listings."
  };

  return (
    <div className="landing-page">
      <Helmet>
        <title>AutoPulse: Streamline Your Used Car Business | Car Listing Scraper & Manager</title>
        <meta name="description" content="AutoPulse helps you efficiently scrape, manage, and post used car listings. Streamline your dealership's workflow with our powerful SAAS tool." />
        <meta name="keywords" content="car scraper, used car listings, auto dealer software, car inventory management" />
        <link rel="canonical" href="https://www.autopulse.com" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 mb-4">
            Streamline Your <span className="text-indigo-600">Used Car Business</span> with AutoPulse
          </h1>
          <p className="text-xl text-gray-600 mb-8">Efficiently scrape, manage, and post your car inventory with our powerful SAAS tool.</p>
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex items-center border-b border-indigo-500 py-2">
              <input 
                className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" 
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button 
                className="flex-shrink-0 bg-indigo-500 hover:bg-indigo-700 border-indigo-500 hover:border-indigo-700 text-sm border-4 text-white py-1 px-2 rounded" 
                type="submit"
              >
                Get Started
              </button>
            </div>
          </form>
        </div>
        <Link 
              to="/lead-form" 
              className="inline-flex items-center px-6 py-3 border border-indigo-600 text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 transition-colors duration-300"
            >
              Find Your Perfect Car
              <ClipboardList className="ml-2 -mr-1 h-5 w-5" />
            </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <FeatureCard 
            icon={Car}
            title="Efficient Scraping"
            description="Scrape car listings from any website with our powerful, SEO-friendly tool."
          />
          <FeatureCard 
            icon={Database}
            title="Smart Management"
            description="Organize and manage your inventory with ease, improving your site's SEO."
          />
          <FeatureCard 
            icon={Facebook}
            title="Automated Posting"
            description="Automatically post your listings to Facebook Marketplace, boosting visibility."
          />
        </div>

        <div className="text-center">
          <a 
            href="/demo" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-300"
          >
            See how it works
            <ChevronRight className="ml-2 -mr-1 h-5 w-5" />
          </a>
        </div>
      </main>
    </div>
  );
}