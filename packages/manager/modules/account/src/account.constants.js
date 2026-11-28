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

// Removes the "information is correct" checkbox from the SIRET component
// template (shared with sign-up), without touching the rest of it.
export const removeConfirmationCheckbox = (template) => {
  const container = document.createElement('template');
  container.innerHTML = template;
  container.content
    .querySelectorAll('oui-checkbox[data-name="isCorrectCheckbox"]')
    .forEach((checkbox) => checkbox.remove());
  return container.innerHTML;
};

// Safety net behind the disabled UI: any write sent from the account section
// is rejected before reaching the API, as a 403-like response so the existing
// error handlers display it.
export const accountReadOnlyInterceptor = /* @ngInject */ ($q) => ({
  request: (config) =>
    isAccountWriteRequest(config)
      ? $q.reject({
          config,
          status: 403,
          statusText: 'Forbidden',
          data: { message: 'Account edition is suspended.' },
          headers: () => null,
        })
      : config,
});

export default {
  FEATURES,
  GDPR_FEATURES_FEATURE,
  KYC_INDIA_FEATURE,
};
