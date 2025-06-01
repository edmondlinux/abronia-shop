// Currency mapping based on country codes
const CURRENCY_MAP = {
  // North America - USD
  US: { symbol: '$', code: 'USD' },
  CA: { symbol: '$', code: 'CAD' }, // You had CAD but said you want $ for Canada
  MX: { symbol: '$', code: 'USD' },

  // Europe - EUR
  DE: { symbol: '€', code: 'EUR' },
  FR: { symbol: '€', code: 'EUR' },
  IT: { symbol: '€', code: 'EUR' },
  ES: { symbol: '€', code: 'EUR' },
  NL: { symbol: '€', code: 'EUR' },
  BE: { symbol: '€', code: 'EUR' },
  AT: { symbol: '€', code: 'EUR' },
  PT: { symbol: '€', code: 'EUR' },
  IE: { symbol: '€', code: 'EUR' },
  FI: { symbol: '€', code: 'EUR' },
  GR: { symbol: '€', code: 'EUR' },
  LU: { symbol: '€', code: 'EUR' },
  MT: { symbol: '€', code: 'EUR' },
  CY: { symbol: '€', code: 'EUR' },
  SK: { symbol: '€', code: 'EUR' },
  SI: { symbol: '€', code: 'EUR' },
  EE: { symbol: '€', code: 'EUR' },
  LV: { symbol: '€', code: 'EUR' },
  LT: { symbol: '€', code: 'EUR' },
  HR: { symbol: '€', code: 'EUR' },
  // Add more European countries
  PL: { symbol: '€', code: 'EUR' }, // Poland (not eurozone but you want € for Europe)
  CZ: { symbol: '€', code: 'EUR' }, // Czech Republic
  HU: { symbol: '€', code: 'EUR' }, // Hungary
  RO: { symbol: '€', code: 'EUR' }, // Romania
  BG: { symbol: '€', code: 'EUR' }, // Bulgaria
  SE: { symbol: '€', code: 'EUR' }, // Sweden
  DK: { symbol: '€', code: 'EUR' }, // Denmark
  NO: { symbol: '€', code: 'EUR' }, // Norway
  CH: { symbol: '€', code: 'EUR' }, // Switzerland

  // UK - GBP
  GB: { symbol: '£', code: 'GBP' },
  UK: { symbol: '£', code: 'GBP' },

  // Asia - USD (as per your requirement)
  JP: { symbol: '$', code: 'USD' },
  CN: { symbol: '$', code: 'USD' },
  IN: { symbol: '$', code: 'USD' },
  KR: { symbol: '$', code: 'USD' },
  SG: { symbol: '$', code: 'USD' },
  TH: { symbol: '$', code: 'USD' },
  MY: { symbol: '$', code: 'USD' },
  ID: { symbol: '$', code: 'USD' },
  PH: { symbol: '$', code: 'USD' },
  VN: { symbol: '$', code: 'USD' },

  // Add more countries as needed - all others default to USD
};

// Default currency
const DEFAULT_CURRENCY = { symbol: '$', code: 'USD' };

// Get user's location using IP geolocation
export const getUserLocation = async () => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    return data.country_code;
  } catch (error) {
    console.error('Error fetching user location:', error);
    return 'US'; // Default to US
  }
};

// Get currency based on country code
export const getCurrencyForCountry = (countryCode) => {
  return CURRENCY_MAP[countryCode] || DEFAULT_CURRENCY;
};

// Get user's currency (combines location detection and currency mapping)
export const getUserCurrency = async () => {
  try {
    const countryCode = await getUserLocation();
    return getCurrencyForCountry(countryCode);
  } catch (error) {
    console.error('Error getting user currency:', error);
    return DEFAULT_CURRENCY;
  }
};

// Format price with currency (simple concatenation as requested)
export const formatPrice = (price, currency) => {
  return `${currency.symbol}${price}`;
};