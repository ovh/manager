export const SERVICE_TYPE = {
  EMAIL_DOMAIN: 'EMAIL_DOMAIN',
  ENTERPRISE_CLOUD_DATABASE: 'ENTERPRISE_CLOUD_DATABASE',
  EXCHANGE: 'EMAIL_EXCHANGE',
  HOSTING_PRIVATE_DATABASE: 'HOSTING_PRIVATE_DATABASE',
  HOSTING_WEB: 'HOSTING_WEB',
  LICENSE_HYCU: 'LICENSE_HYCU',
  OVH_CLOUD_CONNECT: 'OVH_CLOUD_CONNECT',
  PACK_XDSL: 'PACK_XDSL',
  SMS: 'SMS',
  TELEPHONY: 'TELEPHONY',
  WEBCOACH: 'WEBCOACH',
  ALL_DOM: 'ALL_DOM',
  OKMS: 'OKMS_RESOURCE',
  VEEAM_BACKUP: 'VMWARE_CLOUD_DIRECTOR_BACKUP',
  VRACK_SERVICES: 'VRACK_SERVICES_RESOURCE',
  VRACK: 'VRACK',
  VMWARE_CLOUD_DIRECTOR_ORGANIZATION: 'VMWARE_CLOUD_DIRECTOR_ORGANIZATION',
  NUTANIX: 'NUTANIX',
};

export const RENEW_URL = {
  default: '/cgi-bin/order/renew.cgi?domainChooser=',
  AU: 'https://ca.ovh.com/au/cgi-bin/order/renew.cgi?domainChooser=',
  CA: 'https://ca.ovh.com/fr/cgi-bin/order/renew.cgi?domainChooser=',
  CZ: 'https://www.ovh.cz/cgi-bin/order/renew.cgi?domainChooser=',
  DE: 'https://www.ovh.de/cgi-bin/order/renew.cgi?domainChooser=',
  EN: 'https://www.ovh.co.uk/cgi-bin/order/renew.cgi?domainChooser=',
  ES: 'https://www.ovh.es/cgi-bin/order/renew.cgi?domainChooser=',
  FI: 'https://www.ovh-hosting.fi/cgi-bin/order/renew.cgi?domainChooser=',
  FR: 'https://eu.ovh.com/fr/cgi-bin/order/renew.cgi?domainChooser=',
  GB: 'https://www.ovh.co.uk/cgi-bin/order/renew.cgi?domainChooser=',
  IE: 'https://www.ovh.ie/cgi-bin/order/renew.cgi?domainChooser=',
  IT: 'https://www.ovh.it/cgi-bin/order/renew.cgi?domainChooser=',
  LT: 'https://www.ovh.lt/cgi-bin/order/renew.cgi?domainChooser=',
  MA: 'https://www.ovh.com/ma/cgi-bin/order/renew.cgi?domainChooser=',
  NL: 'https://www.ovh.nl/cgi-bin/order/renew.cgi?domainChooser=',
  PL: 'https://www.ovh.pl/cgi-bin/order/renew.cgi?domainChooser=',
  PT: 'https://www.ovh.pt/cgi-bin/order/renew.cgi?domainChooser=',
  QC: 'https://ca.ovh.com/fr/cgi-bin/order/renew.cgi?domainChooser=',
  RU: 'https://www.ovh.co.uk/cgi-bin/order/renew.cgi?domainChooser=',
  SG: 'https://ca.ovh.com/sg/cgi-bin/order/renew.cgi?domainChooser=',
  SN: 'https://www.ovh.sn/cgi-bin/order/renew.cgi?domainChooser=',
  TN: 'https://www.ovh.com/tn/cgi-bin/order/renew.cgi?domainChooser=',
  WE: 'https://ca.ovh.com/fr/cgi-bin/order/renew.cgi?domainChooser=',
};

export const SERVICE_ACTIVE_STATUS = 'ACTIVE';

export default {
  SERVICE_ACTIVE_STATUS,
  RENEW_URL,
  SERVICE_TYPE,
};
