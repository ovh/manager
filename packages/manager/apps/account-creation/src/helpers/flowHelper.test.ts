import { describe, it, expect } from 'vitest';
import {
  shouldAccessOrganizationSearch,
  shouldEnableSIRENDisplay,
  getSirenFromSiret,
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
