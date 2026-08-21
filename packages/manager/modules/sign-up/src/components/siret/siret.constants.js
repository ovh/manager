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

// "Nom de {{ companyType }}" — the translation key suffix is the legal form itself
// (siret_manual_company_name_corporation / _association / _administration).
export const COMPANY_NAME_LABEL_DEFAULT = 'siret_manual_company_name';
export const COMPANY_NAME_LABEL_LEGAL_FORMS = [
  LEGAL_FORM_ENTERPRISE,
  LEGAL_FORM_ASSOCIATION,
  LEGAL_FORM_ADMINISTRATION,
];

export const UPDATE_SEARCH_ASSISTANT_LABEL_DEFAULT =
  'siret_update_search_assistant';

export const MODAL_REVIEW_INTRO_DEFAULT = 'siret_modal_review_intro';

/**
 * Appends the legal form to a translation key when a dedicated wording exists
 * (entreprise / association / administration), otherwise keeps the base key.
 */
export function byLegalForm(baseKey, legalForm) {
  return COMPANY_NAME_LABEL_LEGAL_FORMS.includes(legalForm)
    ? `${baseKey}_${legalForm}`
    : baseKey;
}

/** "Nom de l'entreprise / l'association / l'administration" */
export function getCompanyNameLabelKey(legalForm) {
  return byLegalForm(COMPANY_NAME_LABEL_DEFAULT, legalForm);
}

/** "Mettre à jour mes informations d'entreprise / d'association / d'administration" */
export function getUpdateSearchAssistantLabelKey(legalForm) {
  return byLegalForm(UPDATE_SEARCH_ASSISTANT_LABEL_DEFAULT, legalForm);
}

/** "Vérifiez vos informations d'entreprise / d'association / d'administration" */
export function getModalReviewIntroKey(legalForm) {
  return byLegalForm(MODAL_REVIEW_INTRO_DEFAULT, legalForm);
}

// Maps the search-assistant field aliases (used for enabling/disabling inputs)
// to their matching key in the rules object.
export const SIRET_RULE_FIELD = {
  organisation: 'organisation',
  siret: 'companyNationalIdentificationNumber',
  vat: 'vat',
};

// Legal-form code (INSEE "catégorie juridique") prefixes used to derive the
// account type from a company selected through the search assistant.
// Rule (mirrors account-creation's Company.helpers): 9.* => association,
// 4.* / 7.* / 8110 => administration, anything else => corporation.
export const LEGAL_FORM_CODE_ASSOCIATION = /^9\d+$/;
export const LEGAL_FORM_CODE_ADMINISTRATION = /^(4\d+|7\d+|8110)$/;

/** Derives the legal form from a legalFormCode, or null when the code is missing. */
export function getLegalFormFromCode(code) {
  if (!code) {
    return null;
  }
  if (LEGAL_FORM_CODE_ASSOCIATION.test(code)) {
    return LEGAL_FORM_ASSOCIATION;
  }
  if (LEGAL_FORM_CODE_ADMINISTRATION.test(code)) {
    return LEGAL_FORM_ADMINISTRATION;
  }
  return LEGAL_FORM_ENTERPRISE;
}

/** Computes a French VAT number from a 9-digit SIREN, or null when invalid. */
export function calculateFRVATNumber(siren) {
  const parsedSiren = Number.parseInt(siren, 10);
  if (!siren || String(siren).length !== 9 || Number.isNaN(parsedSiren)) {
    return null;
  }
  const checksum = String((12 + 3 * (parsedSiren % 97)) % 97).padStart(2, '0');
  return `FR${checksum}${siren}`;
}

export const SIRET_SEARCH_REGEXP = /^(?:\d\s*){14}$/;

export const SIRET_FOCUS_PARAM = 'siretForm';

/**
 * Broadcast from an ancestor scope to (re)open the SIRET lookup modal, so an
 * error message rendered outside the siret component can send the customer
 * straight to the company lookup.
 */
export const OPEN_SEARCH_MODAL_EVENT = 'siret:openSearchModal';

export const NON_DISCLOSED_VALUE = '[ND]';

const ND_TOKEN = /\[ND\]/gi;

/** True when a suggestion value contains only [ND] placeholder tokens. */
export function isNdValue(value) {
  if (!value) return false;
  return (
    String(value)
      .replace(ND_TOKEN, '')
      .trim() === ''
  );
}

/** Returns empty string for [ND] values, otherwise the suggestion value or previous. */
export function fromSuggestion(value, previous) {
  return isNdValue(value) ? '' : value || previous;
}

/**
 * Suggestion values the search assistant fills the form with. A withheld value
 * comes back in one of two shapes depending on the provider: the [ND] token, or
 * an empty string (DATA_GOUV_RECHERCHE_ENTREPRISES answers "" for a company that
 * does not disclose its data). Both mean the customer must type it in.
 * The address is only usable when street, postcode AND city are all present.
 */
export const ASSISTANT_FILLED_VALUES = ['name', 'address', 'zipCode', 'city'];

/** True when the directory returned nothing usable for a value. */
export function isMissingValue(value) {
  return !fromSuggestion(value, '');
}

/** True when at least one value the assistant fills came back empty or withheld. */
export function hasMissingValues(suggestion) {
  return ASSISTANT_FILLED_VALUES.some((key) =>
    isMissingValue(suggestion?.[key]),
  );
}

export default {
  LEGAL_FORM,
  PREFIX_TRANSLATION_LEGAL_FORM,
  TRACKING_PREFIX,
  LEGAL_FORM_ENTERPRISE,
  LEGAL_FORM_ASSOCIATION,
  LEGAL_FORM_ADMINISTRATION,
  VAT_CHECKBOX_LABEL_BY_LEGAL_FORM,
  COMPANY_NAME_LABEL_DEFAULT,
  COMPANY_NAME_LABEL_LEGAL_FORMS,
  UPDATE_SEARCH_ASSISTANT_LABEL_DEFAULT,
  SIRET_RULE_FIELD,
  SIRET_SEARCH_REGEXP,
  SIRET_FOCUS_PARAM,
  OPEN_SEARCH_MODAL_EVENT,
};
