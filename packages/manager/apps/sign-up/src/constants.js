export const HOME_PAGE = {
  default: 'https://www.ovh.com',
  AU: 'https://www.ovh.com.au',
  CZ: 'https://www.ovh.cz',
  DE: 'https://www.ovh.de',
  ES: 'https://www.ovh.es',
  FI: 'https://www.ovh-hosting.fi',
  FR: 'https://www.ovh.com/fr/',
  GB: 'https://www.ovh.co.uk',
  IE: 'https://www.ovh.ie',
  IT: 'https://www.ovh.it',
  LTE: 'https://www.ovh.lt',
  LT: 'https://www.ovh.lt',
  MA: 'https://www.ovh.com/ma/',
  NL: 'https://www.ovh.nl',
  PL: 'https://www.ovh.pl',
  PT: 'https://www.ovh.pt',
  QC: 'https://www.ovh.com/ca/fr/',
  SN: 'https://www.ovh.sn',
  TN: 'https://www.ovh.com/tn/',
  US: 'https://www.ovh.com/us/',
  WE: 'https://www.ovh.com/us/',
  WS: 'https://www.ovh.com/us/es/',
};

const LOGO_CONFIG = {
  default: 'assets/img/logo/logo-ovhcloud.png',
  set:
    'assets/img/logo/logo-ovhcloudx2.png 2x, assets/img/logo/logo-ovhcloudx3.png 3x',
};

const US_LOGO_CONFIG = {
  default: 'assets/img/logo/logo-ovhcloud-tm.png',
  set:
    'assets/img/logo/logo-ovhcloud-tmx2.png 2x, assets/img/logo/logo-ovhcloud-tmx3.png 3x',
};

export const LOGO_SRC = {
  default: LOGO_CONFIG,
  US: US_LOGO_CONFIG,
};

export const SANITIZATION = {
  regex: /^\s*(?:(?:(?:https?|ftp|file|blob):\/\/(?:(?:(?:[^./?#]+\.)*(?:ovh|(?:ovhcloud(?=\.com))|(?:ovhtelecom(?=\.fr))|(?:ovh-hosting(?=\.fi))|soyoustart|kimsufi)\.(?:com|net|org|ovh|co\.uk|com\.tn|cz|de|es|eu|fi|fr|ie|it|lt|ma|nl|pl|pt|sn|uk|us))|localhost|127\.0\.0\.1)(?::\d+)?)|data:image)(?:\/|$)/i,
};

export default {
  HOME_PAGE,
  LOGO_SRC,
  SANITIZATION,
};
