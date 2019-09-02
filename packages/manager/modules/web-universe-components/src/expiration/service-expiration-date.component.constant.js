export const DEFAULT_TARGET = 'EU';

export const RENEW_URL = {
  EU: 'https://eu.ovh.com/fr/cgi-bin/order/renew.cgi?domainChooser=',
  CA: 'https://ca.ovh.com/fr/cgi-bin/order/renew.cgi?domainChooser=',
};

export const TERMINATION_URL = {
  EU: 'https://www.ovh.com/manager/#/billing/autoRenew',
  CA: 'https://ca.ovh.com/manager/#/billing/autoRenew',
  US: 'https://us.ovhcloud.com/manager/#/billing/autoRenew',
};

export default {
  DEFAULT_TARGET,
  RENEW_URL,
  TERMINATION_URL,
};
