import { describe, it, expect } from 'vitest';
import {
  CredentialNameErrors,
  credentialNameMaxCharacters,
  validateCredentialName,
} from './validateCredentialName';

describe('validateCredentialName', () => {
  it('should return undefined for a valid name', () => {
    const validName = 'Valid Credential Name';
    expect(validateCredentialName(validName)).toBeUndefined();
  });

  it('should return required error if name is empty', () => {
    const emptyName = '';
    expect(validateCredentialName(emptyName)).toBe(
      CredentialNameErrors.required,
    );
  });

  it('should return tooManyCharacters error if name exceeds 50 characters', () => {
    const longName = 'a'.repeat(credentialNameMaxCharacters + 1);
    expect(validateCredentialName(longName)).toBe(
      CredentialNameErrors.tooManyCharacters,
    );
  });

  it('should return invalidCharacters error if name contains invalid characters', () => {
    const invalidNameWithNonAscii = 'Invalid©Name';
    expect(validateCredentialName(invalidNameWithNonAscii)).toBe(
      CredentialNameErrors.invalidCharacters,
    );
  });

  it('should return undefined for a name with exactly 1 character', () => {
    const singleCharName = 'a';
    expect(validateCredentialName(singleCharName)).toBeUndefined();
  });

  it('should return undefined for a name with exactly 50 characters', () => {
    const maxLengthName = 'a'.repeat(credentialNameMaxCharacters);
    expect(validateCredentialName(maxLengthName)).toBeUndefined();
  });

  it('should return invalidCharacters error if name contains characters below "space"', () => {
    const invalidName = 'Invalid\tName'; // \t (tab) is not valid
    expect(validateCredentialName(invalidName)).toBe(
      CredentialNameErrors.invalidCharacters,
    );
  });
});
