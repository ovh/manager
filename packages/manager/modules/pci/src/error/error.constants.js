/**
 *  @TODO: find a way to import 2x and 3x images at runtime
 */

import OOPS from './assets/oops.png';
// import OOPS2X from './assets/oops@2x.png';
// import OOPS3X from './assets/oops@3x.png';

import PAYPAL_ACCOUNT_NOT_VERIFIED from './assets/paypal_account_not_verified.png';
// import PAYPAL_ACCOUNT_NOT_VERIFIED2X from './assets/paypal_account_not_verified@2x.png';
// import PAYPAL_ACCOUNT_NOT_VERIFIED3X from './assets/paypal_account_not_verified@3x.png';

import MAX_PROJECTS_LIMIT_REACHED from './assets/max_projects_limit_reached.png';
// import MAX_PROJECTS_LIMIT_REACHED2X from './assets/max_projects_limit_reached@2x.png';
// import MAX_PROJECTS_LIMIT_REACHED3X from './assets/max_projects_limit_reached@3x.png';

import ACCOUNT_NOT_ELIGIBLE from './assets/account_not_eligible.png';
// import ACCOUNT_NOT_ELIGIBLE2X from './assets/account_not_eligible@2x.png';
// import ACCOUNT_NOT_ELIGIBLE3X from './assets/account_not_eligible@3x.png';

export const IMAGE_ASSETS = {
  oops: {
    src: OOPS,
    // '2x': OOPS2X,
    // '3x': OOPS3X,
  },
  paypal_account_not_verified: {
    src: PAYPAL_ACCOUNT_NOT_VERIFIED,
    // '2x': PAYPAL_ACCOUNT_NOT_VERIFIED2X,
    // '3x': PAYPAL_ACCOUNT_NOT_VERIFIED3X,
  },
  max_projects_limit_reached: {
    src: MAX_PROJECTS_LIMIT_REACHED,
    // '2x': MAX_PROJECTS_LIMIT_REACHED2X,
    // '3x': MAX_PROJECTS_LIMIT_REACHED3X,
  },
  account_not_eligible: {
    src: ACCOUNT_NOT_ELIGIBLE,
    // '2x': ACCOUNT_NOT_ELIGIBLE2X,
    // '3x': ACCOUNT_NOT_ELIGIBLE3X,
  },
};

export const PAY_DEBT_URL = {
  EU: 'https://www.ovh.com/manager/dedicated/index.html#/billing/history/debt/all/pay',
  CA: 'https://ca.ovh.com/manager/index.html#/billing/history/debt/all/pay',
  US: 'https://us.ovhcloud.com/manager/dedicated/index.html#/billing/history/balance',
};

export default {
  IMAGE_ASSETS,
  PAY_DEBT_URL,
};
