const websiteConfigs = {
    'smsmotors.ca': {
      listingSelector: 'div[class*="inventory_div__car_conatiner"]',
      detailsSelectors: {
        title: '*[class*="inventory_a__title"]',
        price: '[data-cg-price]',
        mileage: '*[class*="mileage"], *[class*="inv-details-line-sol"]',
        year: '.car-year',
        make: '.car-make',
        model: '.car-model',
        vin: '[data-cg-vin]',
        imageUrl: 'img',
        detailsUrl: 'a'
      }
    },
    'another-car-site.com': {
      listingSelector: '.vehicle-card',
      detailsSelectors: {
        title: '.vehicle-header h2',
        price: '.vehicle-price',
        mileage: '.vehicle-mileage',
        year: '.vehicle-year',
        make: '.vehicle-make',
        model: '.vehicle-model',
        imageUrl: '.vehicle-image img',
        detailsUrl: '.vehicle-details-link'
      }
    },
    // Add more website configurations as needed
  };
  
  module.exports = websiteConfigs;