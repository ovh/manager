import { describe, it, expect } from 'vitest';
import {
  shouldAccessOrganizationSearch,
  shouldEnableSIRENDisplay,
  getSirenFromSiret,
  getVatFromCnin,
  getVatFromMersisNo,
  isIndividualLegalForm,
  isB2GLegalForm,
  isUnknownCountry,
  isVatConsistentWithCnin,
  shouldDeriveVatFromCnin,
} from './flowHelper';

describe('shouldAccessOrganizationSearch', () => {
  it('returns true for a French organization that is not individual', () => {
    expect(shouldAccessOrganizationSearch('FR', 'corporation')).toBe(true);
    expect(shouldAccessOrganizationSearch('FR', 'association')).toBe(true);
  });

  it('returns false for an individual', () => {
    expect(shouldAccessOrganizationSearch('FR', 'individual')).toBe(false);
  });

  it('returns false for a non-French country', () => {
    expect(shouldAccessOrganizationSearch('US', 'corporation')).toBe(false);
  });

  it('returns false if country or legalForm is missing', () => {
    expect(shouldAccessOrganizationSearch(undefined, 'corporation')).toBe(
      false,
    );
    expect(shouldAccessOrganizationSearch('FR')).toBe(false);
  });
});

describe('shouldEnableSIRENDisplay', () => {
  it('returns true for a French corporation', () => {
    expect(shouldEnableSIRENDisplay('FR', 'corporation')).toBe(true);
  });

  it('returns false for other legal forms', () => {
    expect(shouldEnableSIRENDisplay('FR', 'association')).toBe(false);
    expect(shouldEnableSIRENDisplay('FR', 'individual')).toBe(false);
  });

  it('returns false for a non-French country', () => {
    expect(shouldEnableSIRENDisplay('US', 'corporation')).toBe(false);
  });

  it('returns false if country or legalForm is missing', () => {
    expect(shouldEnableSIRENDisplay(undefined, 'corporation')).toBe(false);
    expect(shouldEnableSIRENDisplay('FR')).toBe(false);
  });
});

describe('getSirenFromSiret', () => {
  const pattern = '^[0-9]{14}$';

  it('returns the first 9 digits of a valid SIRET', () => {
    expect(getSirenFromSiret('12345678912345', pattern)).toBe('123456789');
  });

  it('returns null if the SIRET does not match the pattern', () => {
    expect(getSirenFromSiret('ABC123', pattern)).toBeNull();
  });

  it('returns null if the SIRET or pattern is missing', () => {
    expect(getSirenFromSiret(undefined, pattern)).toBeNull();
    expect(getSirenFromSiret('12345678912345', null)).toBeNull();
  });
});

describe('isIndividualLegalForm', () => {
  it('should return true when legalForm is "individual"', () => {
    expect(isIndividualLegalForm('individual')).toBe(true);
  });

  it('should return false when legalForm is "association"', () => {
    expect(isIndividualLegalForm('association')).toBe(false);
  });

  it('should return false when legalForm is "administration"', () => {
    expect(isIndividualLegalForm('administration')).toBe(false);
  });

  it('should return false when legalForm is "corporation"', () => {
    expect(isIndividualLegalForm('corporation')).toBe(false);
  });

  it('should return false when legalForm is undefined', () => {
    expect(isIndividualLegalForm(undefined)).toBe(false);
  });
});

describe('isB2GLegalForm', () => {
  it('should return true when legalForm is "administration"', () => {
    expect(isB2GLegalForm('administration')).toBe(true);
  });

  it('should return false for B2B legal forms', () => {
    expect(isB2GLegalForm('corporation')).toBe(false);
    expect(isB2GLegalForm('association')).toBe(false);
  });

  it('should return false when legalForm is undefined', () => {
    expect(isB2GLegalForm(undefined)).toBe(false);
  });
});

describe('isUnknownCountry', () => {
  it('should return true when country is undefined', () => {
    expect(isUnknownCountry(undefined)).toBe(true);
  });

  it('should return true when country is an empty string', () => {
    expect(isUnknownCountry('')).toBe(true);
  });

  it('should return true when country is the UNKNOWN sentinel', () => {
    expect(isUnknownCountry('UNKNOWN')).toBe(true);
  });

  it('should return false for a real country code', () => {
    expect(isUnknownCountry('FR')).toBe(false);
  });
});

const MERSIS_NO = '0123456789012345';
const MERSIS_VAT = '0123456789';

describe('getVatFromMersisNo', () => {
  it('returns the first 10 digits of a 16 digit MERSİS No', () => {
    expect(getVatFromMersisNo(MERSIS_NO)).toBe(MERSIS_VAT);
  });

  it.each(['', '012345678901234', '01234567890123456'])(
    'returns null for %s, which is not 16 digits long',
    (mersisNo) => {
      expect(getVatFromMersisNo(mersisNo)).toBeNull();
    },
  );

  it('returns null when the MERSİS No is not all digits', () => {
    expect(getVatFromMersisNo('012345678901234X')).toBeNull();
  });
});

describe('shouldDeriveVatFromCnin', () => {
  it('returns true for Turkey', () => {
    expect(shouldDeriveVatFromCnin('TR')).toBe(true);
  });

  it('returns false for a country that is not covered, and for none', () => {
    expect(shouldDeriveVatFromCnin('FR')).toBe(false);
    expect(shouldDeriveVatFromCnin(undefined)).toBe(false);
  });
});

describe('getVatFromCnin', () => {
  it('derives the VAT number from a Turkish MERSİS No', () => {
    expect(getVatFromCnin('TR', MERSIS_NO)).toBe(MERSIS_VAT);
  });

  it('ignores the spaces of a MERSİS No typed in groups', () => {
    expect(getVatFromCnin('TR', '0123 4567 8901 2345')).toBe(MERSIS_VAT);
  });

  it('returns null while the MERSİS No is still incomplete', () => {
    expect(getVatFromCnin('TR', '01234567890')).toBeNull();
  });

  it('returns null for a country that derives no VAT number', () => {
    expect(getVatFromCnin('FR', MERSIS_NO)).toBeNull();
  });

  it('returns null when the country or the identifier is missing', () => {
    expect(getVatFromCnin(undefined, MERSIS_NO)).toBeNull();
    expect(getVatFromCnin('TR', undefined)).toBeNull();
  });
});

describe('isVatConsistentWithCnin', () => {
  it('accepts the VAT number derived from the MERSİS No', () => {
    expect(isVatConsistentWithCnin('TR', MERSIS_VAT, MERSIS_NO)).toBe(true);
  });

  it('accepts it whatever spacing it was typed with', () => {
    expect(isVatConsistentWithCnin('TR', '0123 456 789', MERSIS_NO)).toBe(true);
  });

  it('rejects a VAT number that is not the first 10 digits', () => {
    expect(isVatConsistentWithCnin('TR', '9999999999', MERSIS_NO)).toBe(false);
  });

  it('rejects a VAT number that only starts like the MERSİS No', () => {
    expect(isVatConsistentWithCnin('TR', '012345678', MERSIS_NO)).toBe(false);
    expect(isVatConsistentWithCnin('TR', MERSIS_NO, MERSIS_NO)).toBe(false);
  });

  it('accepts an empty VAT number: "I have a VAT number" is unchecked', () => {
    expect(isVatConsistentWithCnin('TR', '', MERSIS_NO)).toBe(true);
    expect(isVatConsistentWithCnin('TR', undefined, MERSIS_NO)).toBe(true);
  });

  it('accepts anything while the MERSİS No cannot be derived from', () => {
    expect(isVatConsistentWithCnin('TR', '9999999999', '0123')).toBe(true);
    expect(isVatConsistentWithCnin('TR', '9999999999', undefined)).toBe(true);
  });

  it('accepts anything for a country that derives no VAT number', () => {
    expect(isVatConsistentWithCnin('FR', 'FR12345678901', '12345678901')).toBe(
      true,
    );
  });
});
