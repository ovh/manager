export const USER_TYPE = {
  corporation: 'enterprise',
  association: 'association',
  individual: 'particular',
  institution: 'institution',
  default: 'others',
};

export const LEGAL_LINK1 =
  'https://www.cert-in.org.in/PDF/CERT-In_Directions_70B_28.04.2022.pdf';
export const LEGAL_LINK2 =
  'https://www.cert-in.org.in/PDF/CERT-In_Directions_70B_28.04.2022.pdf';
export const LEGAL_LINK3 = {
  FR: 'https://www.ovhcloud.com/fr/terms-and-conditions/privacy-policy/',
  DE: 'https://www.ovhcloud.com/de/terms-and-conditions/privacy-policy/',
  ES: 'https://www.ovhcloud.com/es-es/terms-and-conditions/privacy-policy/',
  IT: 'https://www.ovhcloud.com/it/terms-and-conditions/privacy-policy/',
  PL: 'https://www.ovhcloud.com/pl/terms-and-conditions/privacy-policy/',
  PT: 'https://www.ovhcloud.com/pt/terms-and-conditions/privacy-policy/',
  IN: 'https://www.ovhcloud.com/en-in/terms-and-conditions/privacy-policy/',
  OTHERS: 'https://www.ovhcloud.com/en-gb/terms-and-conditions/privacy-policy/',
};

export const MAX_SIZE = 10000000;

export const TRACKING_PREFIX = 'dedicated::account::identity-files';

export const TRACKING_TASK_TAG = {
  upload: `${TRACKING_PREFIX}::upload`,
  uploadSuccess: `${TRACKING_PREFIX}::upload-success`,
  uploadError: `${TRACKING_PREFIX}::upload-error`,
  gotToHub: `${TRACKING_PREFIX}::goto-hub`,
};

export const KYC_STATUS = {
  OPEN: 'open',
  REQUIRED: 'required',
  OK: 'ok',
};

export const KYC_ALLOWED_FILE_EXTENSIONS = ['jpg', 'jpeg', 'pdf', 'png'];

export const DELAY_BETWEEN_RETRY = 3 * 1000;

export const MAX_RETRIES = 1;

export default {
  USER_TYPE,
  MAX_SIZE,
  TRACKING_PREFIX,
  TRACKING_TASK_TAG,
  LEGAL_LINK1,
  LEGAL_LINK2,
  LEGAL_LINK3,
  KYC_STATUS,
  KYC_ALLOWED_FILE_EXTENSIONS,
  DELAY_BETWEEN_RETRY,
  MAX_RETRIES,
};
