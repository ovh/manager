import { describe, it, expect } from 'vitest';
import {
  validateCredentialCreationMethod,
  CredentialCreationMethodErrors,
} from './validateCredentialCreationMethod';

describe('validateCredentialCreationMethod', () => {
  it('should return undefined if csr is a valid non-empty string', () => {
    const validCsr =
      'MIICvTCCAaUCAQAwNTELMAkGA1UEBhMCRlIxETAPBgNVBAgMCEJyaXR0YW55MRMw';
    expect(validateCredentialCreationMethod(validCsr)).toBeUndefined();
  });

  it('should return "REQUIRED" error if csr is an empty string', () => {
    const emptyCsr = '';
    expect(validateCredentialCreationMethod(emptyCsr)).toBe(
      CredentialCreationMethodErrors.required,
    );
  });

  it('should return undefined error if csr is null', () => {
    const nullCsr: string = null;
    expect(validateCredentialCreationMethod(nullCsr)).toBeUndefined();
  });

  it('should return undefined if csr is a non-empty string with spaces', () => {
    const validCsrWithSpaces =
      '  MIICvTCCAaUCAQAwNTELMAkGA1UEBhMCRlIxETAPBgNVBAgMCEJyaXR0YW55MRMw  ';
    expect(
      validateCredentialCreationMethod(validCsrWithSpaces),
    ).toBeUndefined();
  });

  it('should return "REQUIRED" error if csr is a string with only spaces', () => {
    const spacesOnlyCsr = '   ';
    expect(validateCredentialCreationMethod(spacesOnlyCsr.trim())).toBe(
      CredentialCreationMethodErrors.required,
    );
  });
});
