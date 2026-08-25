import { User } from '@ovh-ux/manager-config';
import {
  getContentKeyPrefix,
  isConcernedByInvalidSiret,
  isSiretValid,
  isUserConcernedByBusinessVerification,
} from './companyInformationModal.helpers';

const buildUser = (user: Partial<User>) =>
  ({
    legalform: 'corporation',
    country: 'FR',
    certificates: [],
    companyNationalIdentificationNumber: '98471504500014',
    ...user,
  } as User);

describe('isSiretValid', () => {
  it.each(['98471504500014', '44306184100047'])(
    'should accept the 14 digits of %s adding up to a Luhn checksum',
    (siret) => {
      expect(isSiretValid(siret)).toBe(true);
    },
  );

  it('should accept a La Poste SIRET, which carries no Luhn checksum', () => {
    expect(isSiretValid('35600000009075')).toBe(true);
  });

  it('should reject a La Poste SIRET whose digits do not add up to a multiple of 5', () => {
    expect(isSiretValid('35600000009076')).toBe(false);
  });

  it.each([
    ['an empty value', ''],
    ['a missing value', undefined],
    ['fewer than 14 digits', '984715045'],
    ['more than 14 digits', '984715045000141'],
    ['a letter', '9847150450001A'],
    ['a formatted SIRET', '984 715 045 00014'],
    ['a broken Luhn checksum', '12345678901234'],
    ['a valid 14-digit checksum over an invalid SIREN', '12345678000006'],
    ['a zeroed SIREN, which passes Luhn trivially', '00000000000000'],
  ])('should reject %s', (_, siret) => {
    expect(isSiretValid(siret)).toBe(false);
  });
});

describe('isConcernedByInvalidSiret', () => {
  it('should catch a company without a valid SIRET', () => {
    const user = buildUser({ companyNationalIdentificationNumber: '' });

    expect(isConcernedByInvalidSiret(user)).toBe(true);
  });

  it.each([
    'individual',
    'personalcorporation',
    'other',
    'association',
    'administration',
  ])('should leave the %s legal form out', (legalform) => {
    const user = buildUser({
      legalform: legalform as User['legalform'],
      companyNationalIdentificationNumber: '',
    });

    expect(isConcernedByInvalidSiret(user)).toBe(false);
  });

  it.each(['FR', 'GP', 'MQ', 'RE'])(
    'should cover the %s customers',
    (country) => {
      const user = buildUser({
        country: country as User['country'],
        companyNationalIdentificationNumber: '',
      });

      expect(isConcernedByInvalidSiret(user)).toBe(true);
    },
  );

  it.each(['GF', 'YT', 'PM', 'DE'])(
    'should leave the %s customers out',
    (country) => {
      const user = buildUser({
        country: country as User['country'],
        companyNationalIdentificationNumber: '',
      });

      expect(isConcernedByInvalidSiret(user)).toBe(false);
    },
  );

  it('should leave an account holding a valid SIRET out', () => {
    expect(isConcernedByInvalidSiret(buildUser({}))).toBe(false);
  });

  it('should catch an account whose SIRET was zeroed out', () => {
    const user = buildUser({
      companyNationalIdentificationNumber: '00000000000000',
    });

    expect(isConcernedByInvalidSiret(user)).toBe(true);
  });
});

describe('isUserConcernedByBusinessVerification', () => {
  it('should keep the certificate holders in', () => {
    const user = buildUser({ certificates: ['fr-e-invoicing-warning'] });

    expect(isUserConcernedByBusinessVerification(user)).toBe(true);
  });

  it.each(['FR', 'GP', 'MQ', 'RE', 'GF', 'YT', 'BL', 'PM'])(
    'should reach a %s certificate holder, beyond the SIRET countries',
    (country) => {
      const user = buildUser({
        country: country as User['country'],
        certificates: ['fr-e-invoicing-critical'],
      });

      expect(isUserConcernedByBusinessVerification(user)).toBe(true);
    },
  );

  it('should leave a certificate holder outside France out', () => {
    const user = buildUser({
      country: 'DE',
      certificates: ['fr-e-invoicing-critical'],
    });

    expect(isUserConcernedByBusinessVerification(user)).toBe(false);
  });

  it('should take in an account without any certificate but with an invalid SIRET', () => {
    const user = buildUser({ companyNationalIdentificationNumber: '' });

    expect(isUserConcernedByBusinessVerification(user)).toBe(true);
  });

  it('should leave out an account without certificate holding a valid SIRET', () => {
    expect(isUserConcernedByBusinessVerification(buildUser({}))).toBe(false);
  });
});

describe('getContentKeyPrefix', () => {
  it.each([
    ['fr-e-invoicing-account-to-review', 'company_information_modal_review'],
    ['fr-e-invoicing-warning', 'company_information_modal'],
    ['fr-e-invoicing-critical', 'company_information_modal'],
  ])('should let the %s certificate wording win over the SIRET one', (certificate, expected) => {
    const user = buildUser({
      certificates: [certificate],
      companyNationalIdentificationNumber: '',
    });

    expect(getContentKeyPrefix(user)).toBe(expected);
  });

  it('should fall back to the SIRET wording without any certificate', () => {
    const user = buildUser({ companyNationalIdentificationNumber: '' });

    expect(getContentKeyPrefix(user)).toBe('company_information_modal_siret');
  });
});
