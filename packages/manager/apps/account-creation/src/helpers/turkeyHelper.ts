import { z } from 'zod';
import { Rule, RuleField } from '@/types/rule';

/**
 * Türkiye — keyed on the address country. The specification writes "TK"; the
 * API country code is `TR` (`TK` is Tokelau).
 *
 * The API rules drive the form (`POST /newAccount/rules`): which identifiers
 * are shown, whether they are mandatory, their format, and the account types
 * offered. For the Company, Non-profit and Public administration categories the
 * front only lays them out at the top of the legal block — the VKN
 * (`nationalIdentificationNumber`), the KDV choice, the read-only KDV (`vat`,
 * equal to the VKN) when the organisation has one, then the MERSİS No or, for
 * a public administration, the DETSİS No (`companyNationalIdentificationNumber`)
 * — and refuses what a pattern cannot express: a single repeated digit, a
 * straight run of digits.
 */
export const TURKEY_COUNTRY = 'TR';

export const isTurkeyCountry = (country?: string | null) =>
  (country ?? '').toUpperCase() === TURKEY_COUNTRY;

/** The Turkish company categories; with `individual`, the only valid ones. */
export const TURKEY_COMPANY_LEGAL_FORMS = [
  'corporation',
  'association',
  'administration',
];

export const isTurkishCompany = (
  country?: string | null,
  legalForm?: string | null,
) =>
  isTurkeyCountry(country) &&
  TURKEY_COMPANY_LEGAL_FORMS.includes(legalForm ?? '');

export type TurkeyCninKind = 'mersis' | 'detsis';

/** MERSİS No for Company and Non-profit, DETSİS No for Public administration. */
export const turkeyCninKind = (
  country?: string | null,
  legalForm?: string | null,
): TurkeyCninKind | null => {
  if (!isTurkishCompany(country, legalForm)) return null;
  return legalForm === 'administration' ? 'detsis' : 'mersis';
};

/** The Turkish identifiers: the VKN, then the MERSİS No or the DETSİS No. */
export type TurkeyIdentifier = 'vkn' | TurkeyCninKind;

/** What the front refuses; the length and the format are the API pattern's. */
export type TurkeyIdentifierProblem = 'identical' | 'sequence';

const cleanIdentifier = (value?: string | null) =>
  (value ?? '').replace(/\s/g, '');

/** Each digit one step from the previous one modulo 10, up or down. */
const isStraightRun = (digits: string) => {
  const steps = new Set<number>();
  for (let i = 1; i < digits.length; i += 1) {
    steps.add((Number(digits[i]) - Number(digits[i - 1]) + 10) % 10);
  }
  return steps.size === 1 && (steps.has(1) || steps.has(9));
};

/**
 * The front check of a Turkish identifier: no single repeated digit, no
 * straight ascending or descending run (wrapping from 9 to 0). An empty value
 * is left to `mandatory`, a value that is not all digits to the API pattern.
 */
export const turkeyIdentifierProblem = (
  value: string | null | undefined,
): TurkeyIdentifierProblem | null => {
  const digits = cleanIdentifier(value);
  if (digits.length < 2 || !/^\d+$/.test(digits)) return null;
  if (/^(\d)\1*$/.test(digits)) return 'identical';
  if (isStraightRun(digits)) return 'sequence';
  return null;
};

/**
 * The KDV choice: `has` = "my organisation has a KDV number (equal to the
 * VKN)", `none` = "it has no KDV number", `undefined` = not chosen yet. Never
 * sent: the API only receives `vat`.
 */
export type KdvChoice = 'has' | 'none';

export const KDV_CHOICES: KdvChoice[] = ['has', 'none'];

/** The API pattern accepts the cleaned value (no pattern, or a broken one: yes). */
const matchesRule = (digits: string, rule: Rule | undefined) => {
  if (!rule?.regularExpression) return true;
  try {
    return new RegExp(rule.regularExpression).test(digits);
  } catch {
    return true;
  }
};

/**
 * The `vat` sent: the VKN when the organisation has a KDV number and the VKN is
 * valid (API pattern and front check), `''` otherwise (no KDV number, no choice
 * yet, empty or refused VKN).
 */
export const turkeyKdvValue = (
  choice: KdvChoice | null | undefined,
  vkn: string | null | undefined,
  vknRule: Rule | undefined,
) => {
  if (choice !== 'has') return '';
  const digits = cleanIdentifier(vkn);
  if (
    !digits ||
    !matchesRule(digits, vknRule) ||
    turkeyIdentifierProblem(digits)
  )
    return '';
  return digits;
};

const VKN = 'nationalIdentificationNumber' as RuleField;
const CNIN = 'companyNationalIdentificationNumber' as RuleField;
const VAT = 'vat' as RuleField;

/** Zod messages, translated by `turkeyErrorKey`. */
export const TURKEY_ERRORS = {
  required: 'required_field',
  identical: 'error_turkey_identical',
  sequence: 'error_turkey_sequence',
  pattern: 'error_pattern',
  kdvChoice: 'error_turkey_kdv_choice',
} as const;

/**
 * A Turkish identifier field, from its API rule: `mandatory`, then the API
 * `regularExpression`, then the front check. Optional fields accept `''` (sent
 * as nothing).
 */
const turkeyIdentifierSchema = (rule: Rule) => {
  const { mandatory } = rule;
  const checked = z
    .string()
    .superRefine((value, ctx) => {
      const digits = cleanIdentifier(value);
      if (!digits) {
        if (mandatory) {
          ctx.addIssue({ code: 'custom', message: TURKEY_ERRORS.required });
        }
        return;
      }
      if (!matchesRule(digits, rule)) {
        ctx.addIssue({ code: 'custom', message: TURKEY_ERRORS.pattern });
        return;
      }
      const problem = turkeyIdentifierProblem(digits);
      if (problem) {
        ctx.addIssue({ code: 'custom', message: TURKEY_ERRORS[problem] });
      }
    })
    .transform((value) => cleanIdentifier(value) || undefined);
  return mandatory ? checked : checked.optional();
};

/**
 * The Türkiye schema fields, merged over the rules-driven schema for a Turkish
 * company, each one only when the API returns its rule: VKN, MERSİS / DETSİS
 * No, and for `vat` the derived KDV (never validated, sent as is, `''`
 * included) with the KDV choice (required, never sent).
 */
export const turkeySchemaFields = (
  rules: Record<RuleField, Rule> | undefined,
  input: { country?: string | null; legalForm?: string | null },
): z.ZodRawShape => {
  if (!rules || !isTurkishCompany(input.country, input.legalForm)) return {};
  return {
    ...(rules[VKN] && {
      nationalIdentificationNumber: turkeyIdentifierSchema(rules[VKN]),
    }),
    ...(rules[CNIN] && {
      companyNationalIdentificationNumber: turkeyIdentifierSchema(rules[CNIN]),
    }),
    ...(rules[VAT] && {
      vat: z.string().optional(),
      kdvChoice: z.enum(['has', 'none'], {
        errorMap: () => ({ message: TURKEY_ERRORS.kdvChoice }),
      }),
    }),
  };
};

/** The translation key of a Türkiye error, `undefined` for the generic ones. */
export const turkeyErrorKey = (
  message: string | undefined,
  identifier: TurkeyIdentifier,
) => {
  switch (message) {
    case TURKEY_ERRORS.pattern:
      return `account_details_error_${identifier}`;
    case TURKEY_ERRORS.identical:
      return 'account_details_error_identical_digits';
    case TURKEY_ERRORS.sequence:
      return 'account_details_error_sequential_digits';
    case TURKEY_ERRORS.kdvChoice:
      return 'account_details_error_kdv_choice';
    default:
      return undefined;
  }
};
