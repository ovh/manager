/**
 * Different areas where the manager is deployed
 * These areas are smaller than Regions
 *
 * @typedef   {object}    Subsidiary
 * @property  {string}    currencyName    - ISO 4217 currency code
 * @property  {string}    defaultLanguage - Language to use if no language to use was determined
 * @property  {string}    name            - Name of the subsidiary
 */
export default {
  ASIA: { // Asia
    currencyName: 'USD',
    defaultLanguage: 'en_GB',
    name: 'ASIA',
  },
  AU: { // Australia
    currencyName: 'AUD',
    defaultLanguage: 'en_GB',
    name: 'AU',
  },
  CA: { // Canada
    currencyName: 'CAD',
    defaultLanguage: 'en_GB',
    name: 'CA',
  },
  CZ: { // Czech Republic
    currencyName: 'CZK',
    defaultLanguage: 'en_GB',
    name: 'CZ',
  },
  DE: { // Germany
    currencyName: 'EUR',
    defaultLanguage: 'de_DE',
    name: 'DE',
  },
  ES: { // Spain
    currencyName: 'EUR',
    defaultLanguage: 'es_ES',
    name: 'ES',
  },
  FI: { // Finland
    currencyName: 'EUR',
    defaultLanguage: 'fi_FI',
    name: 'FI',
  },
  FR: { // France
    currencyName: 'EUR',
    defaultLanguage: 'fr_FR',
    name: 'FR',
  },
  GB: { // United Kingdom
    currencyName: 'GBP',
    defaultLanguage: 'en_GB',
    name: 'GB',
  },
  IE: { // World in Euro and English
    currencyName: 'EUR',
    defaultLanguage: 'en_GB',
    name: 'IE',
  },
  IT: { // Italy
    currencyName: 'EUR',
    defaultLanguage: 'it_IT',
    name: 'IT',
  },
  LT: { // Lithuania
    currencyName: 'EUR',
    defaultLanguage: 'lt_LT',
    name: 'LT',
  },
  // There is an internal sub called LTE (for "LT in Euro")
  MA: { // Morroco
    currencyName: 'MAD',
    defaultLanguage: 'en_GB',
    name: 'MA',
  },
  NL: { // Netherlands
    currencyName: 'EUR',
    defaultLanguage: 'en_GB',
    name: 'NL',
  },
  PL: { // Poland
    currencyName: 'PLN',
    defaultLanguage: 'pl_PL',
    name: 'PL',
  },
  PT: { // Portugal
    currencyName: 'EUR',
    defaultLanguage: 'pt_PT',
    name: 'PT',
  },
  QC: { // Quebec
    currencyName: 'CAD',
    defaultLanguage: 'fr_CA',
    name: 'QC',
  },
  SG: { // Singapore
    currencyName: 'SGD',
    defaultLanguage: 'en_GB',
    name: 'SG',
  },
  SN: { // Senegal
    currencyName: 'XOF',
    defaultLanguage: 'en_GB',
    name: 'SN',
  },
  TN: { // Tunisia
    currencyName: 'TND',
    defaultLanguage: 'en_GB',
    name: 'TN',
  },
  US: { // United States of America
    currencyName: 'USD',
    defaultLanguage: 'en_GB',
    name: 'US',
  },
  WE: { // World in Dollar and English
    currencyName: 'USD',
    defaultLanguage: 'en_GB',
    name: 'WE',
  },
  WS: { // Latin America
    currencyName: 'USD',
    defaultLanguage: 'es_ES',
    name: 'WS',
  },
};
