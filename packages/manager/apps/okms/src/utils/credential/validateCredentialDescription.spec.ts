import { describe, it, expect } from 'vitest';
import {
  CredentialDescriptionErrors,
  CredentialDescriptionMaxCharacters,
  validateCredentialDescription,
} from './validateCredentialDescription';

describe('validateCredentialDescription', () => {
  it('should return undefined for a valid description', () => {
    const validDescription = 'This is a valid description!';
    expect(validateCredentialDescription(validDescription)).toBeUndefined();
  });

  it('should return tooManyCharacters error if description exceeds 200 characters', () => {
    const longDescription = 'a'.repeat(CredentialDescriptionMaxCharacters + 1);
    expect(validateCredentialDescription(longDescription)).toBe(
      CredentialDescriptionErrors.tooManyCharacters,
    );
  });

  it('should return invalidCharacters error if description contains invalid characters', () => {
    const invalidDescription =
      'This description contains invalid characters: \u00A9'; // © is outside the ASCII range
    expect(validateCredentialDescription(invalidDescription)).toBe(
      CredentialDescriptionErrors.invalidCharacters,
    );
  });

  it('should return undefined for an empty description', () => {
    expect(validateCredentialDescription(null)).toBeUndefined();
  });

  it('should return invalidCharacters error if description contains characters below "space"', () => {
    const invalidDescription = 'Invalid\tDescription'; // \t (tab) is not valid
    expect(validateCredentialDescription(invalidDescription)).toBe(
      CredentialDescriptionErrors.invalidCharacters,
    );
  });

  it('should return undefined for a description with exactly 1 character', () => {
    const singleCharDescription = 'a';
    expect(
      validateCredentialDescription(singleCharDescription),
    ).toBeUndefined();
  });

  it('should return undefined for a description with exactly 200 characters', () => {
    const maxDescription = 'a'.repeat(CredentialDescriptionMaxCharacters);
    expect(validateCredentialDescription(maxDescription)).toBeUndefined();
  });
});
