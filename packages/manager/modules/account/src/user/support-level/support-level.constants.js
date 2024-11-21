export const API_MODEL_SUPPORT_LEVEL = 'me.SupportLevel.LevelTypeEnum';

export const SUBSCRIPTION = (level) => [
  {
    planCode: `support_level_${level}`,
    duration: 'P1M',
    productId: 'support',
  },
];

export const URLS = {
  ASIA: {
    standard: 'https://www.ovhcloud.com/asia/support-levels/standard/',
    premium: 'https://www.ovhcloud.com/asia/support-levels/premium/',
    business: 'https://www.ovhcloud.com/asia/support-levels/business/',
    enterprise: 'https://www.ovhcloud.com/asia/support-levels/enterprise/',
  },
  AU: {
    standard: 'https://www.ovhcloud.com/en-au/support-levels/standard/',
    premium: 'https://www.ovhcloud.com/en-au/support-levels/premium/',
    business: 'https://www.ovhcloud.com/en-au/support-levels/business/',
    enterprise: 'https://www.ovhcloud.com/en-au/support-levels/enterprise/',
  },
  CA: {
    standard: 'https://www.ovhcloud.com/en-ca/support-levels/standard/',
    premium: 'https://www.ovhcloud.com/en-ca/support-levels/premium/',
    business: 'https://www.ovhcloud.com/en-ca/support-levels/business/',
    enterprise: 'https://www.ovhcloud.com/en-ca/support-levels/enterprise/',
  },
  CZ: {
    standard: 'https://www.ovhcloud.com/en-ie/support-levels/standard/',
    premium: 'https://www.ovhcloud.com/en-ie/support-levels/premium/',
    business: 'https://www.ovhcloud.com/en-ie/support-levels/business/',
    enterprise: 'https://www.ovhcloud.com/en-ie/support-levels/enterprise/',
  },
  DE: {
    standard: 'https://www.ovhcloud.com/de/support-levels/standard/',
    premium: 'https://www.ovhcloud.com/de/support-levels/premium/',
    business: 'https://www.ovhcloud.com/de/support-levels/business/',
    enterprise: 'https://www.ovhcloud.com/de/support-levels/enterprise/',
  },
  ES: {
    standard: 'https://www.ovhcloud.com/es-es/support-levels/standard/',
    premium: 'https://www.ovhcloud.com/es-es/support-levels/premium/',
    business: 'https://www.ovhcloud.com/es-es/support-levels/business/',
    enterprise: 'https://www.ovhcloud.com/es-es/support-levels/enterprise/',
  },
  FI: {
    standard: 'https://www.ovhcloud.com/en-ie/support-levels/standard/',
    premium: 'https://www.ovhcloud.com/en-ie/support-levels/premium/',
    business: 'https://www.ovhcloud.com/en-ie/support-levels/business/',
    enterprise: 'https://www.ovhcloud.com/en-ie/support-levels/enterprise/',
  },
  FR: {
    standard: 'https://www.ovhcloud.com/fr/support-levels/standard/',
    premium: 'https://www.ovhcloud.com/fr/support-levels/premium/',
    business: 'https://www.ovhcloud.com/fr/support-levels/business/',
    enterprise: 'https://www.ovhcloud.com/fr/support-levels/enterprise/',
  },
  GB: {
    standard: 'https://www.ovhcloud.com/en-gb/support-levels/standard/',
    premium: 'https://www.ovhcloud.com/en-gb/support-levels/premium/',
    business: 'https://www.ovhcloud.com/en-gb/support-levels/business/',
    enterprise: 'https://www.ovhcloud.com/en-gb/support-levels/enterprise/',
  },
  IE: {
    standard: 'https://www.ovhcloud.com/en-ie/support-levels/standard/',
    premium: 'https://www.ovhcloud.com/en-ie/support-levels/premium/',
    business: 'https://www.ovhcloud.com/en-ie/support-levels/business/',
    enterprise: 'https://www.ovhcloud.com/en-ie/support-levels/enterprise/',
  },
  IT: {
    standard: 'https://www.ovhcloud.com/it/support-levels/standard/',
    premium: 'https://www.ovhcloud.com/it/support-levels/premium/',
    business: 'https://www.ovhcloud.com/it/support-levels/business/',
    enterprise: 'https://www.ovhcloud.com/it/support-levels/enterprise/',
  },
  LT: {
    standard: 'https://www.ovhcloud.com/en-ie/support-levels/standard/',
    premium: 'https://www.ovhcloud.com/en-ie/support-levels/premium/',
    business: 'https://www.ovhcloud.com/en-ie/support-levels/business/',
    enterprise: 'https://www.ovhcloud.com/en-ie/support-levels/enterprise/',
  },
  MA: {
    standard: 'https://www.ovhcloud.com/fr-ma/support-levels/standard/',
    premium: 'https://www.ovhcloud.com/fr-ma/support-levels/premium/',
    business: 'https://www.ovhcloud.com/fr-ma/support-levels/business/',
    enterprise: 'https://www.ovhcloud.com/fr-ma/support-levels/enterprise/',
  },
  NL: {
    standard: 'https://www.ovhcloud.com/nl/support-levels/standard/',
    premium: 'https://www.ovhcloud.com/nl/support-levels/premium/',
    business: 'https://www.ovhcloud.com/nl/support-levels/business/',
    enterprise: 'https://www.ovhcloud.com/nl/support-levels/enterprise/',
  },
  PL: {
    standard: 'https://www.ovhcloud.com/pl/support-levels/standard/',
    premium: 'https://www.ovhcloud.com/pl/support-levels/premium/',
    business: 'https://www.ovhcloud.com/pl/support-levels/business/',
    enterprise: 'https://www.ovhcloud.com/pl/support-levels/enterprise/',
  },
  PT: {
    standard: 'https://www.ovhcloud.com/pt/support-levels/standard/',
    premium: 'https://www.ovhcloud.com/pt/support-levels/premium/',
    business: 'https://www.ovhcloud.com/pt/support-levels/business/',
    enterprise: 'https://www.ovhcloud.com/pt/support-levels/enterprise/',
  },
  QC: {
    standard: 'https://www.ovhcloud.com/fr-ca/support-levels/standard/',
    premium: 'https://www.ovhcloud.com/fr-ca/support-levels/premium/',
    business: 'https://www.ovhcloud.com/fr-ca/support-levels/business/',
    enterprise: 'https://www.ovhcloud.com/fr-ca/support-levels/enterprise/',
  },
  SG: {
    standard: 'https://www.ovhcloud.com/en-sg/support-levels/standard/',
    premium: 'https://www.ovhcloud.com/en-sg/support-levels/premium/',
    business: 'https://www.ovhcloud.com/en-sg/support-levels/business/',
    enterprise: 'https://www.ovhcloud.com/en-sg/support-levels/enterprise/',
  },
  SN: {
    standard: 'https://www.ovhcloud.com/fr-sn/support-levels/standard/',
    premium: 'https://www.ovhcloud.com/fr-sn/support-levels/premium/',
    business: 'https://www.ovhcloud.com/fr-sn/support-levels/business/',
    enterprise: 'https://www.ovhcloud.com/fr-sn/support-levels/enterprise/',
  },
  TN: {
    standard: 'https://www.ovhcloud.com/fr-tn/support-levels/standard/',
    premium: 'https://www.ovhcloud.com/fr-tn/support-levels/premium/',
    business: 'https://www.ovhcloud.com/fr-tn/support-levels/business/',
    enterprise: 'https://www.ovhcloud.com/fr-tn/support-levels/business/',
  },
  US: {
    standard: 'https://www.ovhcloud.com/en/support-levels/standard/',
    premium: 'https://www.ovhcloud.com/en/support-levels/premium/',
    business: 'https://www.ovhcloud.com/en/support-levels/business/',
    enterprise: 'https://www.ovhcloud.com/en/support-levels/enterprise/',
  },
  WE: {
    standard: 'https://www.ovhcloud.com/en/support-levels/standard/',
    premium: 'https://www.ovhcloud.com/en/support-levels/premium/',
    business: 'https://www.ovhcloud.com/en/support-levels/business/',
    enterprise: 'https://www.ovhcloud.com/en/support-levels/enterprise/',
  },
  WS: {
    standard: 'https://www.ovhcloud.com/es/support-levels/standard/',
    premium: 'https://www.ovhcloud.com/es/support-levels/premium/',
    business: 'https://www.ovhcloud.com/es/support-levels/business/',
    enterprise: 'https://www.ovhcloud.com/es/support-levels/enterprise/',
  },
  IN: {
    standard: 'https://www.ovhcloud.com/en-in/support-levels/standard/',
    premium: 'https://www.ovhcloud.com/en-in/support-levels/premium/',
    business: 'https://www.ovhcloud.com/en-in/support-levels/business/',
    enterprise: 'https://www.ovhcloud.com/en-in/support-levels/enterprise/',
  },
};

export default {
  API_MODEL_SUPPORT_LEVEL,
  SUBSCRIPTION,
  URLS,
};
