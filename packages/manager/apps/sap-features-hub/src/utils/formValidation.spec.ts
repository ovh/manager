import { describe, expect, test } from 'vitest';
import { OdsInputChangeEvent } from '@ovhcloud/ods-components';
import {
  isValidDomain,
  isValidInput,
  isValidSapPassword,
  isValidUrl,
} from './formValidation';

describe('isValid test suite', () => {
  it('should return true if input is valid', () => {
    const testTrue = { detail: { validity: { valid: true } } };
    expect(isValidInput(testTrue as OdsInputChangeEvent)).toBe(true);
  });
  it('should return false if input is invalid', () => {
    const testFalse = { detail: { validity: { valid: false } } };
    expect(isValidInput(testFalse as OdsInputChangeEvent)).toBe(false);
  });
});

describe('isValidUrl test suite', () => {
  test.each([
    ['https://example.com', true],
    ['http://localhost:3000', true],
    ['https://intranet', true],
    ['https://190.190.1.1:8080', true],
    ['ftp://files.example.com', true],
    ['example.com', false],
    ['https://', false],
    ['https://256.256.256.256', false],
    ['ftp://', false],
    ['', false],
  ])('should evaluate validity of URL %s as: %s', (input, expected) => {
    expect(isValidUrl(input)).toBe(expected);
  });
});

describe('isValidDomain test suite', () => {
  test.each([
    ['example.com', true],
    ['other.example.com', true],
    ['example.co.uk', true],
    ['example-site.org', true],
    ['example', false],
    ['-dashstart.com', false],
    ['dashend-.com', false],
    ['double..dot.com', false],
    ['example.123', false],
    [
      '64caracterssubdomain-zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz.com',
      false,
    ],
    [
      '254caractersdomain-zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz.63caracterssubdomain-zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz.63caracterssubdomain-zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz.60caracterssubdomain-zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz.com',
      false,
    ],
  ])('should evaluate validity of domain %s as: %s', (input, expected) => {
    expect(isValidDomain(input)).toBe(expected);
  });
});

describe('isValidSapPassword test suite', () => {
  test.each([
    ['Password1!', true],
    ["Pa1!@$%&/()=? '*+~#-.,;:{[]}<>_|", true],
    ['Short1!', false],
    ['NOLOWER1!', false],
    ['noupper1!', false],
    ['Nonumber!', false],
    ['Nospecial1', false],
    ['Invalid1char€', false],
  ])(
    'should evaluate validity of SAP password %s as: %s',
    (input, expected) => {
      expect(isValidSapPassword(input)).toBe(expected);
    },
  );
});
