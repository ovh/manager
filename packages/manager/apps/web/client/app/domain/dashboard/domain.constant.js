export const ALERTS = {
  tabs: 'domain_alert_tabs',
};

const URL_SUFFIX = 'cgi-bin/order/renew.cgi?domainChooser=';

export const RENEW_URL = {
  DEFAULT: `https://www.ovh.com/${URL_SUFFIX}`,
  AU: `https://ca.ovh.com/au/${URL_SUFFIX}`,
  CA: `https://ca.ovh.com/fr/${URL_SUFFIX}`,
  CZ: `https://www.ovh.cz/${URL_SUFFIX}`,
  DE: `https://www.ovh.de/${URL_SUFFIX}`,
  EN: `https://www.ovh.co.uk/${URL_SUFFIX}`,
  ES: `https://www.ovh.es/${URL_SUFFIX}`,
  FI: `https://www.ovh-hosting.fi/${URL_SUFFIX}`,
  FR: `https://eu.ovh.com/fr/${URL_SUFFIX}`,
  GB: `https://www.ovh.co.uk/${URL_SUFFIX}`,
  IE: `https://www.ovh.ie/${URL_SUFFIX}`,
  IT: `https://www.ovh.it/${URL_SUFFIX}`,
  LT: `https://www.ovh.lt/${URL_SUFFIX}`,
  MA: `https://www.ovh.com/ma/${URL_SUFFIX}`,
  NL: `https://www.ovh.nl/${URL_SUFFIX}`,
  PL: `https://www.ovh.pl/${URL_SUFFIX}`,
  PT: `https://www.ovh.pt/${URL_SUFFIX}`,
  QC: `https://ca.ovh.com/fr/${URL_SUFFIX}`,
  RU: `https://www.ovh.co.uk/${URL_SUFFIX}`,
  SG: `https://ca.ovh.com/sg/${URL_SUFFIX}`,
  SN: `https://www.ovh.sn/${URL_SUFFIX}`,
  TN: `https://www.ovh.com/tn/${URL_SUFFIX}`,
  WE: `https://ca.ovh.com/fr/${URL_SUFFIX}`,
};

export const DOMAIN_SERVICE_STATUS = {
  EXPIRED: 'expired',
  RESTORABLE: 'restorable',
  DELETED: 'deleted',
  PEDING_DELETE: 'pending_delete',
  OUTGOING_TRANSFER: 'outgoing_transfer',
  DISPUTE: 'dispute',
  OK: 'ok',
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

export const CONTACT_MANAGEMENT_TRACKING = {
  name:
    'web::domain::domain-name::main-tabnav::go-to-tab::contact-management_domain-name',
  page_theme: 'Domains',
  type: 'action',
};

export default {
  ALERTS,
  WHOIS_STATUS,
  WHOIS_ALL_CONTACT_OPTIN_RULE,
  DOMAIN_OPTION_STATUS,
  RENEW_URL,
  DOMAIN_SERVICE_STATUS,
  CONTACT_MANAGEMENT_TRACKING,
};

angular.module('App').constant('DOMAIN', {
  ALERTS,
  WHOIS_STATUS,
  DOMAIN_OPTION_STATUS,
});
