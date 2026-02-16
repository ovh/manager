export const GENERAL_KEY = 'general';
export const PROFILE_KEY = 'profile';
export const CONTACT_KEY = 'contact';
export const OTHER_KEY = 'other';

export const SECTIONS: Record<string, string[]> = {
  [GENERAL_KEY]: [
    'legalForm',
    'organisationName',
    'organisationType',
    'corporationType',
    'legalFormCategory',
    'companyNationalIdentificationNumber',
    'vat',
    'trademarkId',
    'associationNationalIdentificationNumber',
  ],
  [PROFILE_KEY]: [
    'gender',
    'firstName',
    'lastName',
    'nationality',
    'nationalIdentificationNumber',
    'birthDay',
    'birthCountry',
    'birthCity',
    'birthZip',
    'language',
  ],
  [CONTACT_KEY]: [
    'address',
    'address.country',
    'address.province',
    'address.zip',
    'address.city',
    'address.line1',
    'address.line2',
    'address.line3',
    'address.otherDetails',
    'cellPhone',
    'phone',
    'email',
  ],
};

export const FORCED_FIELDS: Record<string, string> = {
  firstName: 'firstName',
  lastName: 'lastName',
};

export const FIELD_NAME_LIST: Record<string, string> = {
  legalform: 'legalForm',
  legalFormCategory: 'legalFormCategory',
  organisationName: 'organisationName',
  organisationType: 'organisationType',
  corporationType: 'corporationType',
  trademarkId: 'trademarkId',
  companyNationalIdentificationNumber: 'companyNationalIdentificationNumber',
  vat: 'vat',
  gender: 'gender',
  firstName: 'firstName',
  lastName: 'lastName',
  nationality: 'nationality',
  nationalIdentificationNumber: 'nationalIdentificationNumber',
  birthDay: 'birthDay',
  birthCity: 'birthCity',
  language: 'language',
  addressCountry: 'address.country',
  country: 'address.country',
  province: 'address.province',
  zip: 'address.zip',
  city: 'address.city',
  line1: 'address.line1',
  line2: 'address.line2',
  line3: 'address.line3',
  otherDetails: 'address.otherDetails',
  email: 'email',
  phone: 'phone',
  cellPhone: 'cellPhone',
  registrantDocumentType: 'registrantDocumentType',
};

export const OPERATORS = {
  BETWEEN: 'between',
  CONTAINS: 'contains',
  EMPTY: 'empty',
  EQ: 'eq',
  GT: 'gt',
  GTE: 'gte',
  LT: 'lt',
  LTE: 'lte',
  MATCH: 'match',
  MAXLENGTH: 'maxlength',
  MINLENGTH: 'minlength',
  NE: 'ne',
  NOTCONTAINS: 'notcontains',
  NOTEMPTY: 'notempty',
  READONLY: 'readonly',
  REQUIRED: 'required',
  SHOULDBETRUE: 'shouldbetrue',
} as const;

export const CONTACT_MANAGEMENT_EDIT_TRACKING = {
  SUBMIT: {
    actionType: 'action' as const,
    actions: ['edit_holder-contact_confirm'],
  },
  CANCEL: {
    actionType: 'navigation' as const,
    actions: ['edit_holder-contact_cancel'],
  },
  LINK: {
    actionType: 'navigation' as const,
    actions: ['edit_holder_next'],
  },
};

export const OWNER_CONTACT_LABEL = 'OWNER_CONTACT';

export const CONFIGURATION_RULE_ACTIONS = {
  UPDATE: 'update',
} as const;

export const DATE_FORMAT_PLACEHOLDER = 'YYYY-MM-DD';

/**
 * Builds the translation key for a form field label.
 */
export const getFieldLabelKey = (label: string): string =>
  `domain_tab_CONTACT_edit_form_label_${label.split('.').join('_')}`;
