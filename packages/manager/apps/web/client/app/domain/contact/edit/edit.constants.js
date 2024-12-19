export const FORM_PART_PREFIX = 'form_part_';
export const OVH_FIELD_PREFIX = 'ovh_field_';
export const POINT_SEPARATOR = '.';

export const GENERAL_KEY = 'general';
export const PROFILE_KEY = 'profile';
export const CONTACT_KEY = 'contact';
export const OTHER_KEY = 'other';

export const SECTIONS = {
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

export const FIELD_NAME_LIST = {
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
};

export const REQUIRED = 'required';
export const READ_ONLY = 'readonly';
export const MAX_LENGTH = 'maxlength';
export const STRICT_EQUAL = 'eq';
export const NOT_EQUAL = 'ne';
export const CONTAINS = 'contains';

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
};

export const REGEX = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/,
  PHONE: /^\+(\d{1,5}\.)?\d{1,15}$/,
};

export default {
  POINT_SEPARATOR,
  FORM_PART_PREFIX,
  OVH_FIELD_PREFIX,
  SECTIONS,
  FIELD_NAME_LIST,
  GENERAL_KEY,
  PROFILE_KEY,
  CONTACT_KEY,
  OTHER_KEY,
  REQUIRED,
  READ_ONLY,
  MAX_LENGTH,
  STRICT_EQUAL,
  NOT_EQUAL,
  CONTAINS,
  OPERATORS,
  REGEX,
};
