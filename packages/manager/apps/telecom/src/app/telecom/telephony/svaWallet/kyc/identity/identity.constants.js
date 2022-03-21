export const REGEX_VALIDATORS = {
  SIRET: /^\d{14}$/,
  APE: /^\d{4}[a-zA-Z]$/,
  URLWEBSITE: /(?:^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$)|(?:^$)/,
};

export const TYPES = {
  PRO: 'PRO',
  RESELLER: 'RESELLER',
};

export const DISALLOW_BENEFICIARIES_KINDS = ['MICRO_ENTERPRISE'];
export const FORCE_REPRESENTAIVE_IS_BENEFICIARY_KINDS = ['MICRO_ENTERPRISE'];

export const WEBSITE_URL_DEFAULT = 'https://www.ovhcloud.com';

export default {
  DISALLOW_BENEFICIARIES_KINDS,
  FORCE_REPRESENTAIVE_IS_BENEFICIARY_KINDS,
  TYPES,
  REGEX_VALIDATORS,
  WEBSITE_URL_DEFAULT,
};
