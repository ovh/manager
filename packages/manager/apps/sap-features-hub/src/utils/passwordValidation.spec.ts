import { describe, test, expect } from 'vitest';
import {
  isValidSapPassword,
  isValidSapHanaPassword,
} from './passwordValidation';

describe('common sapPassword & sapHanaPassword requirements', () => {
  test.each([
    ['Short123!', false],
    ['ExceedMaxLengthOf30Chars!abcdef', false],
    ['WITHOUTLOWERCASE1!', false],
    ['withoutuppercase1!', false],
    ['withoutnumber!', false],
    ['With1TemplateSyntaxStart{%', false],
    ['With1TemplateSyntaxEnd%}', false],
  ])('should be invalid for both SAP password types: %s', (input) => {
    expect(isValidSapPassword(input)).toBe(false);
    expect(isValidSapHanaPassword(input)).toBe(false);
  });

  test.each([
    ['Password1!', true],
    ['MaxLengthOf30Chars!abcdefghijk', true],
  ])('should be valid for both SAP password types: %s', (input) => {
    expect(isValidSapPassword(input)).toBe(true);
    expect(isValidSapHanaPassword(input)).toBe(true);
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
    ['Password1!?+=/*%{}()[]', true],
    ['1StartingWithDigit_', true],
    ['_1StartingWithUnderscore', true],
  ])(
    'should evaluate validity of SAP password %s as: %s',
    (input, expected) => {
      expect(isValidSapPassword(input)).toBe(expected);
    },
  );
});

describe('isValidSapHanaPassword test suite', () => {
  test.each([
    ['1StartingWithDigit_', false],
    ['_1StartingWithUnderscore', false],
    ['WithForbiddenChars1!?+=/*%}]', false],
    ['WithoutRequiredSpecialChar?=+-', false],

    ['Password1!', true],
    ['With5AllowedSpecialChars!_#@$', true],
  ])(
    'should evaluate validity of SAP_HANA password %s as: %s',
    (input, expected) => {
      expect(isValidSapHanaPassword(input)).toBe(expected);
    },
  );
});
