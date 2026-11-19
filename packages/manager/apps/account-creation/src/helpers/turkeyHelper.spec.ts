import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { Rule, RuleField } from '@/types/rule';
import { getZodSchemaFromRule } from '@/hooks/zod/useZod';
import {
  isTurkishCompany,
  turkeyCninKind,
  turkeyErrorKey,
  turkeyIdentifierProblem,
  turkeyKdvValue,
  turkeySchemaFields,
} from './turkeyHelper';

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

const rules = (over: Partial<Record<string, Rule>> = {}) =>
  ({
    organisation: rule({ mandatory: true }),
    phone: rule({ prefix: '+90' }),
    ...over,
  } as Record<RuleField, Rule>);

/** What `POST /newAccount/rules` returns for a Turkish company. */
const turkishRules = (legalForm = 'corporation') =>
  rules({
    phone: rule({ mandatory: true, prefix: '+90' }),
    nationalIdentificationNumber: rule({
      mandatory: true,
      regularExpression: '^\\d{10}$',
    }),
    vat: rule({ regularExpression: '^\\d{10}$' }),
    companyNationalIdentificationNumber: rule({
      regularExpression:
        legalForm === 'administration' ? '^\\d{8}$' : '^\\d{16}$',
    }),
  });

const schemaFor = (
  apiRules: Record<RuleField, Rule>,
  legalForm: string,
  country = 'TR',
) =>
  getZodSchemaFromRule(apiRules).extend(
    turkeySchemaFields(apiRules, { country, legalForm }),
  );

const issueFor = (
  result: z.SafeParseReturnType<unknown, unknown>,
  field: string,
) =>
  result.success
    ? undefined
    : result.error.issues.find((issue) => issue.path[0] === field)?.message;

const valid = {
  organisation: 'Acme AŞ',
  phone: '+905321234567',
  nationalIdentificationNumber: '4829157365',
  kdvChoice: 'has',
  vat: '4829157365',
};

describe('Türkiye — categories', () => {
  it.each([
    ['TR', 'corporation', true],
    ['TR', 'association', true],
    ['TR', 'administration', true],
    ['TR', 'individual', false],
    ['TR', 'personalcorporation', false],
    ['FR', 'corporation', false],
  ])('%s / %s is a Turkish company: %s', (country, legalForm, expected) => {
    expect(isTurkishCompany(country, legalForm)).toBe(expected);
  });

  it('holds a MERSİS No for Company / Non-profit and a DETSİS No for Public administration', () => {
    expect(turkeyCninKind('TR', 'corporation')).toBe('mersis');
    expect(turkeyCninKind('TR', 'association')).toBe('mersis');
    expect(turkeyCninKind('TR', 'administration')).toBe('detsis');
    expect(turkeyCninKind('TR', 'individual')).toBe(null);
    expect(turkeyCninKind('FR', 'corporation')).toBe(null);
  });
});

describe('Türkiye — identifier checks (on top of the API pattern)', () => {
  it.each(['4829157365', '0482915736500017', '24681357'])(
    'accepts %s',
    (value) => {
      expect(turkeyIdentifierProblem(value)).toBe(null);
    },
  );

  it('leaves the length and non-digits to the API pattern', () => {
    expect(turkeyIdentifierProblem('48291a7365')).toBe(null);
    expect(turkeyIdentifierProblem('')).toBe(null);
  });

  it.each([
    ['5555555555', 'identical'],
    ['7890123456', 'sequence'],
    ['3210987654', 'sequence'],
    ['5678901234567890', 'sequence'],
  ] as const)('refuses %s (%s)', (value, problem) => {
    expect(turkeyIdentifierProblem(value)).toBe(problem);
  });
});

describe('Türkiye — the KDV', () => {
  const vknRule = rule({ mandatory: true, regularExpression: '^\\d{10}$' });

  it('is the VKN when the organisation has a KDV number, empty otherwise', () => {
    expect(turkeyKdvValue('has', '4829157365', vknRule)).toBe('4829157365');
    expect(turkeyKdvValue('none', '4829157365', vknRule)).toBe('');
    expect(turkeyKdvValue(undefined, '4829157365', vknRule)).toBe('');
  });

  it('stays empty while the VKN is refused, by the API pattern or the front', () => {
    expect(turkeyKdvValue('has', '482915736', vknRule)).toBe('');
    expect(turkeyKdvValue('has', '7890123456', vknRule)).toBe('');
  });
});

describe('Türkiye — schema, from the API rules', () => {
  it('requires the VKN and a KDV choice for a company, as the API says', () => {
    const schema = schemaFor(turkishRules(), 'corporation');
    expect(schema.safeParse(valid).success).toBe(true);
    const missing = schema.safeParse({
      ...valid,
      nationalIdentificationNumber: '',
      kdvChoice: undefined,
    });
    expect(issueFor(missing, 'nationalIdentificationNumber')).toBe(
      'required_field',
    );
    expect(issueFor(missing, 'kdvChoice')).toBe('error_turkey_kdv_choice');
  });

  it('adds no Turkish field the API does not return', () => {
    expect(
      turkeySchemaFields(rules(), { country: 'TR', legalForm: 'corporation' }),
    ).toEqual({});
    const schema = schemaFor(rules(), 'corporation');
    expect(
      schema.safeParse({ ...valid, nationalIdentificationNumber: '' }).success,
    ).toBe(true);
  });

  it('keeps an optional VKN rule optional', () => {
    const schema = schemaFor(
      rules({ nationalIdentificationNumber: rule() }),
      'corporation',
    );
    expect(
      schema.safeParse({ ...valid, nationalIdentificationNumber: '' }).success,
    ).toBe(true);
  });

  it('gives the reason a VKN is refused: the API pattern, then the front check', () => {
    const schema = schemaFor(turkishRules(), 'corporation');
    const reason = (vkn: string) =>
      issueFor(
        schema.safeParse({ ...valid, nationalIdentificationNumber: vkn }),
        'nationalIdentificationNumber',
      );
    expect(reason('482915736')).toBe('error_pattern');
    expect(reason('5555555555')).toBe('error_turkey_identical');
    expect(reason('7890123456')).toBe('error_turkey_sequence');
  });

  it('keeps the MERSİS / DETSİS No optional, with the format the API gives', () => {
    const corporation = schemaFor(turkishRules('corporation'), 'corporation');
    expect(
      corporation.safeParse({
        ...valid,
        companyNationalIdentificationNumber: '',
      }).success,
    ).toBe(true);
    expect(
      issueFor(
        corporation.safeParse({
          ...valid,
          companyNationalIdentificationNumber: '24681357',
        }),
        'companyNationalIdentificationNumber',
      ),
    ).toBe('error_pattern');
    const administration = schemaFor(
      turkishRules('administration'),
      'administration',
    );
    expect(
      administration.safeParse({
        ...valid,
        companyNationalIdentificationNumber: '24681357',
      }).success,
    ).toBe(true);
  });

  it('keeps an empty vat for "no KDV number" (sent as is)', () => {
    const parsed = schemaFor(turkishRules(), 'corporation').parse({
      ...valid,
      kdvChoice: 'none',
      vat: '',
    }) as Record<string, unknown>;
    expect(parsed.vat).toBe('');
  });

  it('adds nothing outside the Turkish companies', () => {
    expect(
      turkeySchemaFields(turkishRules(), {
        country: 'FR',
        legalForm: 'corporation',
      }),
    ).toEqual({});
    expect(
      turkeySchemaFields(turkishRules(), {
        country: 'TR',
        legalForm: 'individual',
      }),
    ).toEqual({});
  });

  it('maps each Türkiye error to its message key', () => {
    expect(turkeyErrorKey('error_pattern', 'detsis')).toBe(
      'account_details_error_detsis',
    );
    expect(turkeyErrorKey('error_pattern', 'vkn')).toBe(
      'account_details_error_vkn',
    );
    expect(turkeyErrorKey('error_turkey_identical', 'vkn')).toBe(
      'account_details_error_identical_digits',
    );
    expect(turkeyErrorKey('error_turkey_sequence', 'mersis')).toBe(
      'account_details_error_sequential_digits',
    );
    expect(turkeyErrorKey('required_field', 'vkn')).toBeUndefined();
  });
});
