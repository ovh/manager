import { capitalizeFirstLetter } from '@/utils/index';

describe('utils', () => {
  describe('capitalizeFirstLetter', () => {
    it.each([
      ['', ''],
      ['a', 'A'],
      ['high-speed', 'High-speed'],
      ['Toto', 'Toto'],
      ['éléphant', 'Éléphant'],
    ])(
      'should capitalize the first letter, from %s to %s',
      (input: string, expected: string) => {
        const result = capitalizeFirstLetter(input);

        expect(result).toEqual(expected);
      },
    );
  });
});
