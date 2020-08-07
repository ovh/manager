export const ALERTS = {
  tabs: 'domain_alert_tabs',
};

export const WHOIS_STATUS = {
  PENDING: 'pending',
  INVALID_CONTACT: 'Invalid contact number',
};

export const WHOIS_ALL_CONTACT_OPTIN_RULE = ['domain'];

export const DOMAIN_OPTION_STATUS = {
  ACTIVE: 'subscribed',
  INACTIVE: 'released',
};

export default {
  ALERTS,
  WHOIS_STATUS,
  WHOIS_ALL_CONTACT_OPTIN_RULE,
  DOMAIN_OPTION_STATUS,
};

angular.module('App').constant('DOMAIN', {
  ALERTS,
  WHOIS_STATUS,
  DOMAIN_OPTION_STATUS,
});
