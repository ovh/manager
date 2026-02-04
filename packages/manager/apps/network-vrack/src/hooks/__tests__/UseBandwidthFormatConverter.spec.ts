import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import { useBandwidthFormatConverter } from '../useBandwidthFormatConverter';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) =>
      (
        ({
          unit_size_MB: 'MB',
          unit_size_GB: 'GB',
          unit_size_TB: 'TB',
        }) as Record<string, string>
      )[key] ?? key,
  }),
}));

describe('useBandwidthFormatConverter', () => {
  [
    { input: 0, expectedValue: '0', expectedUnit: 'MB' },
    { input: 500, expectedValue: '500', expectedUnit: 'MB' },
    { input: 100000, expectedValue: '100', expectedUnit: 'GB' },
    { input: 1599, expectedValue: '1.59', expectedUnit: 'GB' },
    { input: 1000000, expectedValue: '1', expectedUnit: 'TB' },
    { input: 2558000, expectedValue: '2.55', expectedUnit: 'TB' },
  ].forEach(({ input, expectedValue, expectedUnit }) =>
    it(`should convert ${input} to ${expectedValue} ${expectedUnit}`, () => {
      const { result } = renderHook(() => useBandwidthFormatConverter());
      const convert = result.current;

      const output = convert(input);

      expect(output.value).toBe(expectedValue);
      expect(output.unit).toBe(expectedUnit);
      expect(output.simpleFormat).toBe(`${expectedValue} ${expectedUnit}`);
      expect(output.perSecondFormat).toBe(`${expectedValue}${expectedUnit}/s`);
    }),
  );
});
