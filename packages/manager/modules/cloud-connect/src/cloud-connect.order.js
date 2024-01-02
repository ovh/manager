export const CLOUD_CONNECT_ORDER_URLS = {
  DEFAULT: 'https://ovhcloud.com/en/network-security/ovhcloud-connect/',
  ASIA: 'https://ovhcloud.com/asia/network-security/ovhcloud-connect/',
  IN: 'https://www.ovhcloud.com/en-in/network-security/ovhcloud-connect/',
  DE: 'https://ovhcloud.com/de/network-security/ovhcloud-connect/',
  ES: 'https://ovhcloud.com/es-es/network-security/ovhcloud-connect/',
  IE: 'https://ovhcloud.com/en-ie/network-security/ovhcloud-connect/',
  IT: 'https://ovhcloud.com/it/network-security/ovhcloud-connect/',
  NL: 'https://ovhcloud.com/nl/network-security/ovhcloud-connect/',
  PL: 'https://ovhcloud.com/pl/network-security/ovhcloud-connect/',
  PT: 'https://ovhcloud.com/pt/network-security/ovhcloud-connect/',
  GB: 'https://ovhcloud.com/en-gb/network-security/ovhcloud-connect/',
  CA: 'https://ovhcloud.com/en-ca/network-security/ovhcloud-connect/',
  QC: 'https://ovhcloud.com/fr-ca/network-security/ovhcloud-connect/',
  MA: 'https://ovhcloud.com/fr-ma/network-security/ovhcloud-connect/',
  SN: 'https://ovhcloud.com/fr-sn/network-security/ovhcloud-connect/',
  TN: 'https://ovhcloud.com/fr-tn/network-security/ovhcloud-connect/',
  AU: 'https://ovhcloud.com/en-au/network-security/ovhcloud-connect/',
  SG: 'https://ovhcloud.com/en-sg/network-security/ovhcloud-connect/',
  FR: 'https://ovhcloud.com/fr/network-security/ovhcloud-connect/',
  WE: 'https://ovhcloud.com/en/network-security/ovhcloud-connect/',
  WS: 'https://ovhcloud.com/es/network-security/ovhcloud-connect/',
  US: 'https://us.ovhcloud.com/network/ovhcloud-connect/',
};

export function getCloudConnectOrderUrl(subsidiary) {
  return (
    CLOUD_CONNECT_ORDER_URLS[subsidiary] || CLOUD_CONNECT_ORDER_URLS.DEFAULT
  );
}

export default CLOUD_CONNECT_ORDER_URLS;
