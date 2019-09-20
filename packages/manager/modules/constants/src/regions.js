/**
 * A region is a location where the Manager is deployed
 * A subsidiary can only be in one region
 *
 * Note: a subsidiary may be located in a region different from its
 * geographical location
 *
 * @typedef   {object}      Region
 * @property  {string}      name     - Name of the region
 * @property  {string[]}    subs    - subsidiaries in this region
 */
export default {
  CA: {
    name: 'CA',
    subs: [
      'ASIA',
      'AU',
      'CA',
      'QC',
      'SG',
      'WE',
      'WS',
    ],
  },
  EU: {
    name: 'EU',
    subs: [
      'CZ',
      'DE',
      'ES',
      'FI',
      'FR',
      'GB',
      'IE',
      'IT',
      'LT',
      'MA',
      'NL',
      'PL',
      'PT',
      'SN',
      'TN',
    ],
  },
  US: {
    name: 'US',
    subs: ['US'],
  },
};
