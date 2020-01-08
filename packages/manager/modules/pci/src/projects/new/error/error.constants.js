import OOPS from './assets/oops.png';
import PAYPAL_ACCOUNT_NOT_VERIFIED from './assets/paypal_account_not_verified.png';
import MAX_PROJECTS_LIMIT_REACHED from './assets/max_projects_limit_reached.png';
import ACCOUNT_NOT_ELIGIBLE from './assets/account_not_eligible.png';

export const IMAGE_ASSETS = {
  oops: {
    src: OOPS,
  },
  paypal_account_not_verified: {
    src: PAYPAL_ACCOUNT_NOT_VERIFIED,
  },
  max_projects_limit_reached: {
    src: MAX_PROJECTS_LIMIT_REACHED,
  },
  account_not_eligible: {
    src: ACCOUNT_NOT_ELIGIBLE,
  },
};

export const PAY_DEBT_URL = {
  EU:
    'https://www.ovh.com/manager/dedicated/index.html#/billing/history/debt/all/pay',
  CA: 'https://ca.ovh.com/manager/index.html#/billing/history/debt/all/pay',
  US:
    'https://us.ovhcloud.com/manager/dedicated/index.html#/billing/history/balance',
};

export default {
  IMAGE_ASSETS,
  PAY_DEBT_URL,
};
