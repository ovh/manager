import { describe, expect, it } from 'vitest';
import { Rule } from '@/types/rule';
import { GermanRegisterCourtList } from '@/types/suggestion';
import {
  courtOptions,
  droppedIdentifiers,
  isIdentifierMissing,
  isScope,
  REGISTER_TYPES,
  registerIdIssue,
  registerTypeOf,
  toEuid,
} from './germanyHelper';

// Ported from manager-gcj-account account-rules `countries/de/__tests__/de.spec.ts`.

const TYPES = ['HRA', 'HRB', 'GnR', 'PR', 'VR', 'GsR'];
const LIST = ({
  registerTypes: TYPES,
  courts: [
    { code: 'D2601V', name: 'Amtsgericht München', registers: TYPES },
    {
      code: 'R3306',
      name: 'Amtsgericht Köln',
      registers: ['HRA', 'HRB', 'GnR', 'VR', 'GsR'],
    },
    { code: 'F1103', name: 'Amtsgericht Charlottenburg', registers: ['VR'] },
    {
      code: 'F1103R',
      name: 'Amtsgericht Charlottenburg',
      registers: ['HRA', 'HRB', 'GnR', 'PR', 'GsR'],
    },
  ],
} as unknown) as GermanRegisterCourtList;

const rule = (fieldName: string) =>
  (({ fieldName, mandatory: false } as unknown) as Rule);

describe('germany scope', () => {
  it.each([
    ['DE', 'corporation', true],
    ['de', 'association', true],
    ['DE', 'administration', true],
    ['DE', 'personalcorporation', true],
    ['DE', 'individual', false],
    ['DE', 'other', false],
    ['FR', 'corporation', false],
    [undefined, 'corporation', false],
  ])('isScope(%s, %s) = %s', (country, legalform, expected) => {
    expect(isScope(country, legalform)).toBe(expected);
  });
});

describe('germany EUID', () => {
  it('knows the register types of the court list contract', () => {
    expect([...REGISTER_TYPES].sort()).toEqual([...TYPES].sort());
  });

  it.each([
    ['D2601V', 'HRB 12345', 'DED2601V.HRB12345'],
    ['D2601V', 'hrb 12345 b', 'DED2601V.HRB12345B'],
    ['R3306', 'gnr 7', 'DER3306.GnR7'],
    ['F1103', 'Vr2345', 'DEF1103.VR2345'],
    // An unknown type: upper-cased as typed, for the rules to refuse.
    ['D2601V', 'xy 1', 'DED2601V.XY1'],
    // One part alone: no EUID.
    ['D2601V', '', ''],
    ['', 'HRB 12345', ''],
  ])('toEuid(%j, %j) = %j', (court, number, expected) => {
    expect(toEuid(court, number, TYPES)).toBe(expected);
  });

  it('reads the register type in its canonical spelling', () => {
    expect(registerTypeOf(' gsr 1', TYPES)).toBe('GsR');
    expect(registerTypeOf('12345', TYPES)).toBeNull();
    expect(registerTypeOf('HRB 1', [])).toBeNull();
  });

  it.each([
    ['', '', null],
    ['D2601V', 'HRB 1', null],
    ['', 'HRB 1', 'courtRequired'],
    ['D2601V', ' ', 'numberRequired'],
  ])('registerIdIssue(%j, %j) = %s', (court, number, expected) => {
    expect(registerIdIssue(court, number)).toBe(expected);
  });
});

describe('germany court list', () => {
  it('offers every court before a type is typed, a twice-held name with its code', () => {
    expect(courtOptions(LIST, '', '')).toEqual([
      { code: 'D2601V', name: 'Amtsgericht München', offered: true },
      { code: 'R3306', name: 'Amtsgericht Köln', offered: true },
      {
        code: 'F1103',
        name: 'Amtsgericht Charlottenburg (F1103)',
        offered: true,
      },
      {
        code: 'F1103R',
        name: 'Amtsgericht Charlottenburg (F1103R)',
        offered: true,
      },
    ]);
  });

  it('offers the courts keeping the type typed', () => {
    expect(courtOptions(LIST, 'pr 45', '').map((o) => o.code)).toEqual([
      'D2601V',
      'F1103R',
    ]);
    expect(courtOptions(LIST, 'VR 1', 'F1103').map((o) => o.code)).toEqual([
      'D2601V',
      'R3306',
      'F1103',
    ]);
  });

  it('keeps the current court last when not offered', () => {
    expect(courtOptions(LIST, 'PR 1', 'R3306').at(-1)).toEqual({
      code: 'R3306',
      name: 'Amtsgericht Köln',
      offered: false,
    });
    // A code the list does not hold shows as itself.
    expect(courtOptions(LIST, '', 'Z9999').at(-1)).toEqual({
      code: 'Z9999',
      name: 'Z9999',
      offered: false,
    });
  });
});

describe('germany identifiers', () => {
  it('asks a Company only for at least one identifier its rules ask', () => {
    const rules = { vat: rule('vat') };
    const none = { vat: '', nationalIdentificationNumber: ' ' };
    expect(isIdentifierMissing('corporation', none, rules)).toBe(true);
    expect(isIdentifierMissing('association', none, rules)).toBe(false);
    expect(isIdentifierMissing('administration', none, rules)).toBe(false);
    // Rules asking none of them: nothing to give.
    expect(isIdentifierMissing('corporation', none, {})).toBe(false);
    expect(
      isIdentifierMissing(
        'corporation',
        { ...none, companyNationalIdentificationNumber: 'DED2601V.HRB1' },
        rules,
      ),
    ).toBe(false);
    expect(
      isIdentifierMissing(
        'corporation',
        { nationalIdentificationNumber: 'DE123456789-00001' },
        rules,
      ),
    ).toBe(false);
  });

  it('drops what the rules no longer describe and /me holds', () => {
    const current = {
      vat: 'DE123456789',
      nationalIdentificationNumber: '',
      companyNationalIdentificationNumber: 'DED2601V.HRB1',
    };
    const administration = {
      vat: rule('vat'),
      nationalIdentificationNumber: rule('nationalIdentificationNumber'),
    };
    expect(droppedIdentifiers(administration, current)).toEqual({
      companyNationalIdentificationNumber: '',
    });
    expect(droppedIdentifiers({}, current)).toEqual({
      vat: '',
      companyNationalIdentificationNumber: '',
    });
    expect(droppedIdentifiers({}, null)).toEqual({});
  });
});
