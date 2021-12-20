export interface IAtInternetCustomVar {
  path: Record<string, string>;
  format: string;
}

export type AtInternetCustomVar = string;

export type AtInternetCustomVars = {
  [key in AtInternetCustomVar]: IAtInternetCustomVar;
};

/**
 * This is custom OVHcloud At-Internet configuration of order's customVars attribute.
 */
export const AT_INTERNET_CUSTOM_VARS = {
  /**
   * Country code of the customer making the order
   */
  countryCode: {
    path: {
      default: 'site.1',
      US: 'site.12',
    },
    format: '[%s]',
  },

  /**
   * Currency code of the customer
   */
  currencyCode: {
    path: {
      default: 'site.16',
      US: 'site.15',
    },
    format: '[%s]',
  },

  /**
   * Url for the tracking hit
   */
  pageUrl: {
    path: {
      default: 'site.11',
      US: 'site.10',
    },
    format: '[%s]',
  },

  /**
   * Referrer site
   */

  referrerSite: {
    path: {
      default: 'site.8', // OVH's AtInternet configuration
      US: 'site.11',
    },
    format: '[%s]',
  },

  /**
   * Event
   */
  event: {
    path: {
      default: 'site.20',
      US: 'site.6',
    },
    format: '[%s]',
  },

  siteName: {
    path: {
      default: 'site.13',
      US: 'site.14',
    },
    format: '[%s]',
  },

  /**
   * Project Id
   */
  projectId: {
    path: {
      default: 'page.1', // OVH's AtInternet configuration
    },
    format: '[%s]',
  },

  /**
   * Voucher code used
   */
  voucherCode: {
    path: {
      default: 'page.2', // OVH's AtInternet configuration
    },
    format: '[%s]',
  },

  /**
   * Order status used
   */
  orderStatus: {
    path: {
      default: 'page.1',
    },
    format: '[%s]',
  },
} as AtInternetCustomVars;

export default {
  AT_INTERNET_CUSTOM_VARS,
};
