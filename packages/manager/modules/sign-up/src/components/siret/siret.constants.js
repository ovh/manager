export const PREFIX_TRANSLATION_LEGAL_FORM = 'siret_manual_company_legal_form_';

export const LEGAL_FORM = [
  'EI',
  'EURL',
  'SARL',
  'SASU',
  'SAS',
  'SA',
  'SNC',
  'SCS',
  'SCA',
  'SCOP',
];

export const TRACKING_PREFIX = {
  creation: 'accountcreation::company-search::',
  modification: 'accountmodification::company-search::',
};

export default {
  LEGAL_FORM,
  PREFIX_TRANSLATION_LEGAL_FORM,
  TRACKING_PREFIX,
};
