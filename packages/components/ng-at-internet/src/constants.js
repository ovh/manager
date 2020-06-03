/**
 * This is custom OVHcloud At-Internet configuration of order's customVars attribute.
 */
export const AT_INTERNET_CUSTOM_VARS = {
  /**
   * Country code of the customer making the order
   */
  countryCode: {
    path: 'site.1',
    format: '[%s]',
  },

  /**
   * Currency code of the customer
   */
  currencyCode: {
    path: 'site.16',
    format: '%s',
  },

  /**
   * Event
   */
  event: {
    path: 'site.20',
    format: '[%s]',
  },

  siteName: {
    path: 'site.13',
    format: '%s',
  },
};

export default {
  AT_INTERNET_CUSTOM_VARS,
};
