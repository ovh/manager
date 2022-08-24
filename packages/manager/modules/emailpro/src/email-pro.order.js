export const EMAIL_PRO_ORDER_URLS = {
  DEFAULT: 'https://ovhcloud.com/en/emails/email-pro/',
  ASIA: 'https://ovhcloud.com/asia/emails/email-pro/',
  DE: 'https://ovhcloud.com/de/emails/email-pro/',
  ES: 'https://ovhcloud.com/es-es/emails/email-pro/',
  IE: 'https://ovhcloud.com/en-ie/emails/email-pro/',
  IT: 'https://ovhcloud.com/it/emails/email-pro/',
  NL: 'https://ovhcloud.com/nl/emails/email-pro/',
  PL: 'https://ovhcloud.com/pl/emails/email-pro/',
  PT: 'https://ovhcloud.com/pt/emails/email-pro/',
  GB: 'https://ovhcloud.com/en-gb/emails/email-pro/',
  CA: 'https://ovhcloud.com/en-ca/emails/email-pro/',
  QC: 'https://ovhcloud.com/fr-ca/emails/email-pro/',
  MA: 'https://ovhcloud.com/fr-ma/emails/email-pro/',
  SN: 'https://ovhcloud.com/fr-sn/emails/email-pro/',
  TN: 'https://ovhcloud.com/fr-tn/emails/email-pro/',
  AU: 'https://ovhcloud.com/en-au/emails/email-pro/',
  SG: 'https://ovhcloud.com/en-sg/emails/email-pro/',
  FR: 'https://ovhcloud.com/fr/emails/email-pro/',
  CZ: 'https://ovhcloud.com/cz-cs/emails/email-pro/',
  FI: 'https://ovhcloud.com/fi/emails/email-pro/',
  LT: 'https://ovhcloud.com/lt/emails/email-pro/',
  WE: 'https://ovhcloud.com/us-en/emails/email-pro/',
  WS: 'https://ovhcloud.com/us-en/emails/email-pro/',
};

export function getEmailProOrderUrl(subsidiary) {
  return EMAIL_PRO_ORDER_URLS[subsidiary] || EMAIL_PRO_ORDER_URLS.DEFAULT;
}

export default EMAIL_PRO_ORDER_URLS;
