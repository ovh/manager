export const REGEX_VALIDATORS = {
  SIRET: /^\d{14}$/,
  APE: /^\d{4}[a-zA-Z]$/,
  // URLWEBSITE limits the insertion of invalid URLs. While allowing not to put http or https, but if it is present it requires "://".
  // Also allows to leave empty.
  // Valid exemple: http://exemple.com | exemple.com . Invalid exemple: 1234 | https://exemple?com.
  URLWEBSITE: /(?:^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$)|(?:^$)/,
};

export const TYPES = {
  PRO: 'PRO',
  RESELLER: 'RESELLER',
};

export const DISALLOW_BENEFICIARIES_KINDS = ['MICRO_ENTERPRISE'];
export const FORCE_REPRESENTAIVE_IS_BENEFICIARY_KINDS = ['MICRO_ENTERPRISE'];

export const WEBSITE_URL_DEFAULT = 'https://www.ovhcloud.com';

export const DIRECTORY_WAY_NUMBER_EXTRA_ENUM = [
  'bis',
  'ter',
  'quater',
  'quinquies',
  'sexto',
  'septimo',
  'octimo',
  'nono',
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'S',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
];

export default {
  DISALLOW_BENEFICIARIES_KINDS,
  FORCE_REPRESENTAIVE_IS_BENEFICIARY_KINDS,
  TYPES,
  REGEX_VALIDATORS,
  WEBSITE_URL_DEFAULT,
};
