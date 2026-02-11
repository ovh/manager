import { converToDisplayBandwidth } from '../bandwidth';

describe('converToDisplayBandwidth', () => {
  [
    {
      input: 500,
      expectedValue: '500',
      expectedUnit: 'MB',
    },
    {
      input: 100000,
      expectedValue: '100',
      expectedUnit: 'GB',
    },
    {
      input: 1599,
      expectedValue: '1.59',
      expectedUnit: 'GB',
    },
    {
      input: 1000000,
      expectedValue: '1',
      expectedUnit: 'TB',
    },
    {
      input: 2558000,
      expectedValue: '2.55',
      expectedUnit: 'TB',
    },
  ].forEach(({ input, expectedValue, expectedUnit }) =>
    it(`should convert ${input} to ${expectedValue} ${expectedUnit}`, () => {
      // Given / When
      const output = converToDisplayBandwidth(input);

      // Then
      expect(output).toEqual({ value: expectedValue, unit: expectedUnit });
    }),
  );
});
