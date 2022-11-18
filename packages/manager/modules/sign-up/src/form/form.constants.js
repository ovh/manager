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
];

export const MODEL_DEBOUNCE_DELAY = 500;

export const OVH_SUBSIDIARY_ITEM_NAME = 'ovhSubsidiaryCreationForm';

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
  OVH_SUBSIDIARY_ITEM_NAME,
  READ_ONLY_PARAMS,
};
