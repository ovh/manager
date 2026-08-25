import { describe, expect, it } from 'vitest';

import {
  isSiretMissingOrInvalid,
  isSiretValid,
} from './billing-main-history.helpers';

// 14 digits whose Luhn checksum adds up, and one that does not
const VALID_SIRET = '98471504500014';
const LUHN_INVALID_SIRET = '12345678901234';
// passes the Luhn of its 14 digits, but its SIREN 123456780 does not
const BAD_SIREN_SIRET = '12345678000006';
// La Poste, no Luhn: its digits add up to a multiple of 5
const LA_POSTE_SIRET = '35600000009075';

const buildUser = (user) => ({
  legalform: 'corporation',
  country: 'FR',
  companyNationalIdentificationNumber: VALID_SIRET,
  ...user,
});

describe('isSiretValid', () => {
  it.each([VALID_SIRET, '44306184100047'])(
    'accepts the 14 digits of %s adding up to a Luhn checksum',
    (siret) => {
      expect(isSiretValid(siret)).toBe(true);
    },
  );

  it.each([
    ['an empty value', ''],
    ['a missing value', undefined],
    ['fewer than 14 digits', '984715045'],
    ['more than 14 digits', '984715045000141'],
    ['a letter', '9847150450001A'],
    ['a formatted SIRET', '984 715 045 00014'],
    ['a broken Luhn checksum', LUHN_INVALID_SIRET],
    ['a valid 14-digit checksum over an invalid SIREN', BAD_SIREN_SIRET],
    ['a zeroed SIREN, which passes Luhn trivially', '00000000000000'],
  ])('rejects %s', (_, siret) => {
    expect(isSiretValid(siret)).toBe(false);
  });

  it('accepts a La Poste SIRET, which carries no Luhn checksum', () => {
    expect(isSiretValid(LA_POSTE_SIRET)).toBe(true);
  });

  it('rejects a La Poste SIRET whose digits do not add up to a multiple of 5', () => {
    expect(isSiretValid('35600000009076')).toBe(false);
  });
});

describe('isSiretMissingOrInvalid', () => {
  it('holds the invoices of a company without a SIRET back', () => {
    const user = buildUser({ companyNationalIdentificationNumber: '' });

    expect(isSiretMissingOrInvalid(user)).toBe(true);
  });

  it.each([
    ['failing its checksum', LUHN_INVALID_SIRET],
    ['built on an invalid SIREN', BAD_SIREN_SIRET],
    ['zeroed out', '00000000000000'],
  ])('holds the invoices back on a SIRET %s', (_, siret) => {
    const user = buildUser({ companyNationalIdentificationNumber: siret });

    expect(isSiretMissingOrInvalid(user)).toBe(true);
  });

  it('lets a La Poste establishment through', () => {
    const user = buildUser({
      companyNationalIdentificationNumber: LA_POSTE_SIRET,
    });

    expect(isSiretMissingOrInvalid(user)).toBe(false);
  });

  it.each([
    'individual',
    'personalcorporation',
    'other',
    'association',
    'administration',
  ])('leaves the %s legal form alone', (legalform) => {
    const user = buildUser({
      legalform,
      companyNationalIdentificationNumber: '',
    });

    expect(isSiretMissingOrInvalid(user)).toBe(false);
  });

  it.each(['FR', 'GP', 'MQ', 'RE'])('covers the %s customers', (country) => {
    const user = buildUser({
      country,
      companyNationalIdentificationNumber: '',
    });

    expect(isSiretMissingOrInvalid(user)).toBe(true);
  });

  it.each(['GF', 'YT', 'PM', 'DE'])(
    'leaves the %s customers alone, SIRET or not',
    (country) => {
      const user = buildUser({
        country,
        companyNationalIdentificationNumber: '',
      });

      expect(isSiretMissingOrInvalid(user)).toBe(false);
    },
  );

  it('lets a valid SIRET through', () => {
    expect(isSiretMissingOrInvalid(buildUser({}))).toBe(false);
  });
});
