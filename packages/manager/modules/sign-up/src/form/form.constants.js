export const ENUM_TRANSLATION_RULES = [
  {
    fieldName: 'legalform',
  },
  {
    fieldName: 'country',
    sort: true,
  },
  {
    fieldName: 'phoneCountry',
    fallbackFieldName: 'country',
    sort: true,
  },
  {
    fieldName: 'language',
    sort: true,
  },
  {
    fieldName: 'corporationType',
    sort: true,
  },
  {
    fieldName: 'area',
    dependsOfCountry: true,
    sort: true,
  },
  {
    fieldName: 'sex',
    sort: true,
  },
];

export const MODEL_DEBOUNCE_DELAY = 500;

export const READ_ONLY_PARAMS = [
  'currency',
  'email',
  'nichandle',
  'ovhCompany',
  'customerCode',
  'state',
  'ovhSubsidiary',
];

export default {
  ENUM_TRANSLATION_RULES,
  MODEL_DEBOUNCE_DELAY,
  READ_ONLY_PARAMS,
};
