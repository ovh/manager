export const KYC_INDIA_FEATURE = 'identity-documents';

export const GDPR_FEATURES_FEATURE = 'account:gdpr-features';

export const FEATURES = [KYC_INDIA_FEATURE, GDPR_FEATURES_FEATURE];

// Account edition is suspended on this version of the control panel:
// every page is view-only and points to the latest console.
export const ACCOUNT_READ_ONLY = true;

export const LATEST_CONSOLE_URL = {
  EU: 'https://console.eu.ovhcloud.com/',
  CA: 'https://console.ca.ovhcloud.com/',
  US: 'https://console.us.ovhcloud.com/',
};

// Edit-only states → view state the user lands on instead.
export const ACCOUNT_EDIT_STATES = {
  'account.user.security.mfa': 'account.user.security',
  'account.user.gdpr.confirm': 'account.user.gdpr',
  'account.contacts.services.edit': 'account.contacts.services',
};

// POST calls that only read data, they must stay allowed in read-only mode.
export const READ_ONLY_ALLOWED_POST_URLS = [
  /\/newAccount\/rules$/,
  /\/iam\/resource\/[^/]+\/authorization\/check$/,
];

export const isAccountWriteRequest = ({ method, url }) =>
  !['GET', 'HEAD', 'OPTIONS'].includes((method || 'GET').toUpperCase()) &&
  !READ_ONLY_ALLOWED_POST_URLS.some((pattern) =>
    pattern.test((url || '').split('?')[0]),
  );

export default {
  FEATURES,
  GDPR_FEATURES_FEATURE,
  KYC_INDIA_FEATURE,
};
