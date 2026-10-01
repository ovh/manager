import { Rule, RuleField } from '@/types/rule';

/**
 * F1 Turkey — keyed on the address country. The specification writes "TK"; the API
 * country code is `TR` (`TK` is Tokelau).
 */
export const TURKEY_COUNTRY = 'TR';

/**
 * F1 Turkey — legal forms for which the MERSIS No (stored in
 * companyNationalIdentificationNumber) is mandatory.
 */
export const MERSIS_LEGAL_FORMS = [
  'corporation',
  'personalcorporation',
  'association',
  'administration',
];

/**
 * F1 Turkey — fallback formats, used only when the API rule declares no
 * regularExpression: MERSIS No = 16 digits, KDV = 10 digits.
 */
export const MERSIS_PATTERN = '^\\d{16}$';
export const KDV_PATTERN = '^\\d{10}$';

export const isTurkeyCountry = (country?: string | null) =>
  (country ?? '').toUpperCase() === TURKEY_COUNTRY;

const EMPTY_RULE: Rule = {
  defaultValue: null,
  examples: null,
  fieldName: null,
  in: null,
  mandatory: false,
  maxLength: null,
  minLength: null,
  prefix: null,
  regularExpression: null,
};

/**
 * F1 Turkey — the rules the form actually works with:
 * - the MERSIS No is mandatory (16 digits) for MERSIS_LEGAL_FORMS, even when
 *   the API sends no rule for it;
 * - the KDV (`vat`) is mandatory iff "I have a VAT number" is ticked.
 * The API regularExpression wins; the patterns are fallbacks only. Outside
 * Turkey the API rules are returned untouched.
 */
export const applyTurkeyRules = (
  rules: Record<RuleField, Rule> | undefined,
  input: {
    country?: string | null;
    legalForm?: string | null;
    hasVatNumber: boolean;
  },
): Record<RuleField, Rule> | undefined => {
  if (!rules || !isTurkeyCountry(input.country)) return rules;
  const result = { ...rules };
  const cnin = 'companyNationalIdentificationNumber' as RuleField;
  const vat = 'vat' as RuleField;

  if (MERSIS_LEGAL_FORMS.includes(input.legalForm ?? '')) {
    const rule = result[cnin] ?? { ...EMPTY_RULE, fieldName: cnin };
    result[cnin] = {
      ...rule,
      mandatory: true,
      regularExpression: rule.regularExpression || MERSIS_PATTERN,
    };
  }
  if (result[vat]) {
    result[vat] = {
      ...result[vat],
      mandatory: input.hasVatNumber,
      regularExpression: result[vat].regularExpression || KDV_PATTERN,
    };
  }
  return result;
};
