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

export const LEGAL_FORM_ENTERPRISE = 'corporation';
export const LEGAL_FORM_ASSOCIATION = 'association';
export const LEGAL_FORM_ADMINISTRATION = 'administration';

export const VAT_CHECKBOX_LABEL_BY_LEGAL_FORM = {
  [LEGAL_FORM_ENTERPRISE]: 'siret_vat_none_corporation',
  [LEGAL_FORM_ASSOCIATION]: 'siret_vat_none_association',
  [LEGAL_FORM_ADMINISTRATION]: 'siret_vat_none_administration',
};

export const NON_DISCLOSED_VALUE = '[ND]';

const ND_TOKEN = /\[ND\]/gi;

/** True when a suggestion value contains only [ND] placeholder tokens. */
export function isNdValue(value) {
  if (!value) return false;
  return value.replace(ND_TOKEN, '').trim() === '';
}

/** Returns empty string for [ND] values, otherwise the suggestion value or previous. */
export function fromSuggestion(value, previous) {
  return isNdValue(value) ? '' : value || previous;
}

export default {
  LEGAL_FORM,
  PREFIX_TRANSLATION_LEGAL_FORM,
  TRACKING_PREFIX,
  LEGAL_FORM_ENTERPRISE,
  LEGAL_FORM_ASSOCIATION,
  LEGAL_FORM_ADMINISTRATION,
  VAT_CHECKBOX_LABEL_BY_LEGAL_FORM,
};
