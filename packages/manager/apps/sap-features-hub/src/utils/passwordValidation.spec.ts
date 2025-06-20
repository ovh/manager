import { describe, test, expect } from 'vitest';
import {
  isValidSapPassword,
  isValidSapHanaPassword,
} from './passwordValidation';

describe('common sapPassword & sapHanaPassword requirements', () => {
  test.each([
    ['Short123!', false],
    ['WITHOUTLOWERCASE1!', false],
    ['withoutuppercase1!', false],
    ['withoutnumber!', false],
    ['With2ConsecutiveSpecialCharacters!?', false],
  ])('should be invalid for both SAP password types: %s', (input) => {
    expect(isValidSapPassword(input)).toBe(false);
    expect(isValidSapHanaPassword(input)).toBe(false);
  });
});

describe('isValidSapPassword test suite', () => {
  test.each([
    ['Password1WithoutSpecialCharacter', false],
    ['Password1\\', false],
    ["Password1'", false],
    ['Password1"', false],
    ['Password1`', false],
    ['Password1$', false],

    ['Password1!', true],
    ['1PasswordStartingWithDigit_', true],
    ['_1PasswordStartingWithUnderscore', true],
  ])(
    'should evaluate validity of SAP password %s as: %s',
    (input, expected) => {
      expect(isValidSapPassword(input)).toBe(expected);
    },
  );
});

describe('isValidSapHanaPassword test suite', () => {
  test.each([
    ['1PasswordStartingWithDigit_', false],
    ['_1PasswordStartingWithUnderscore', false],
    ['Password1WithoutRequiredSpecialChar,?;.:/=+(){}[]&"\'`§°-€£%', false],

    ['Password1!', true],
    ['Password1_', true],
    ['Password1#', true],
    ['Password1@', true],
    ['Password1$', true],
  ])(
    'should evaluate validity of SAP_HANA password %s as: %s',
    (input, expected) => {
      expect(isValidSapHanaPassword(input)).toBe(expected);
    },
  );
});
