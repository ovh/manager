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
    format: '[%s]',
  },

  /**
   * Referrer site
   */

  referrerSite: {
    path: 'site.8', // OVH's AtInternet configuration
    format: '[%s]',
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
    format: '[%s]',
  },

  /**
   * Project Id
   */
  projectId: {
    path: 'page.1', // OVH's AtInternet configuration
    format: '[%s]',
  },

  /**
   * Voucher code used
   */
  voucherCode: {
    path: 'page.2', // OVH's AtInternet configuration
    format: '[%s]',
  },

  /**
   * Order status used
   */
  orderStatus: {
    path: 'page.1',
    format: '[%s]',
  },
};

export default {
  AT_INTERNET_CUSTOM_VARS,
};
