import { describe, expect, it } from 'vitest';
import { Rule, RuleField } from '@/types/rule';
import { getZodSchemaFromRule } from '@/hooks/zod/useZod';
import { applyTurkeyRules } from './turkeyHelper';

const rule = (over: Partial<Rule> = {}): Rule => ({
  defaultValue: null,
  examples: null,
  fieldName: null,
  in: null,
  mandatory: false,
  maxLength: null,
  minLength: null,
  prefix: null,
  regularExpression: null,
  ...over,
});

const baseRules = { vat: rule() } as Record<RuleField, Rule>;
const CNIN = 'companyNationalIdentificationNumber' as RuleField;

describe('F1 Turkey — applyTurkeyRules', () => {
  it.each([
    'corporation',
    'personalcorporation',
    'association',
    'administration',
  ])(
    'makes the MERSIS No mandatory (16 digits) for %s, even without an API rule',
    (legalForm) => {
      const result = applyTurkeyRules(baseRules, {
        country: 'TR',
        legalForm,
        hasVatNumber: false,
      });
      expect(result?.[CNIN]).toMatchObject({
        mandatory: true,
        regularExpression: '^\\d{16}$',
      });
    },
  );

  it('keeps the API regularExpression over the fallback', () => {
    const result = applyTurkeyRules(
      { ...baseRules, [CNIN]: rule({ regularExpression: '^0\\d{15}$' }) },
      { country: 'TR', legalForm: 'corporation', hasVatNumber: false },
    );
    expect(result?.[CNIN].regularExpression).toBe('^0\\d{15}$');
  });

  it('does not add a MERSIS No for other legal forms', () => {
    expect(
      applyTurkeyRules(baseRules, {
        country: 'TR',
        legalForm: 'other',
        hasVatNumber: false,
      })?.[CNIN],
    ).toBeUndefined();
  });

  it('makes the KDV mandatory only when "I have a VAT number" is ticked', () => {
    const rules = { vat: rule({ mandatory: true }) } as Record<RuleField, Rule>;
    const input = { country: 'TR', legalForm: 'corporation' };
    expect(
      applyTurkeyRules(rules, { ...input, hasVatNumber: false })?.vat.mandatory,
    ).toBe(false);
    expect(
      applyTurkeyRules(rules, { ...input, hasVatNumber: true })?.vat,
    ).toMatchObject({ mandatory: true, regularExpression: '^\\d{10}$' });
  });

  it('returns the API rules untouched outside Turkey', () => {
    expect(
      applyTurkeyRules(baseRules, {
        country: 'FR',
        legalForm: 'corporation',
        hasVatNumber: true,
      }),
    ).toBe(baseRules);
  });

  it('the resulting schema rejects a 15-digit MERSIS No and accepts 16 digits', () => {
    const schema = getZodSchemaFromRule(
      applyTurkeyRules(baseRules, {
        country: 'TR',
        legalForm: 'corporation',
        hasVatNumber: false,
      }) as Record<RuleField, Rule>,
    );
    expect(schema.safeParse({ [CNIN]: '123456789012345' }).success).toBe(false);
    expect(schema.safeParse({ [CNIN]: '1234567890123456' }).success).toBe(true);
  });
});
