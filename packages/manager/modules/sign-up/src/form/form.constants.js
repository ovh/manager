export const ENUM_TRANSLATION_RULES = [{
  fieldName: 'legalform',
}, {
  fieldName: 'country',
  sort: true,
}, {
  fieldName: 'phoneCountry',
  fallbackFieldName: 'country',
  sort: true,
}, {
  fieldName: 'language',
  sort: true,
}];

export const MODEL_DEBOUNCE_DELAY = 500;

export default {
  ENUM_TRANSLATION_RULES,
  MODEL_DEBOUNCE_DELAY,
};
