import { instanceNameRegex } from '@/constants';

describe('Instance creation', () => {
  test('Should accept only strings and special characters like "-", "_" and "." with a maximum length of 255', () => {
    const allowedChars = [
      '.',
      '_',
      '-',
      '1',
      'a'.repeat(255),
      '',
      'b3_8_28_17_01',
    ];
    allowedChars.forEach((char) =>
      expect(instanceNameRegex.test(char)).toBe(true),
    );
  });

  test('Should reject all other unauthorized name input', () => {
    const rejectedChars = [
      ' ',
      '!',
      '@',
      '#',
      '$',
      '%',
      '^',
      '&',
      '*',
      '(',
      ')',
      '+',
      '=',
      '[',
      ']',
      '{',
      '}',
      '|',
      ';',
      ':',
      "'",
      '"',
      ',',
      '<',
      '>',
      '/',
      '?',
      '\\',
      '~',
      '`',
      'a'.repeat(256),
    ];
    rejectedChars.forEach((char) =>
      expect(instanceNameRegex.test(char)).toBe(false),
    );
  });
});
