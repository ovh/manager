import { renderHook } from '@testing-library/react';
import { vitest } from 'vitest';
import { DEFAULT_UNKNOWN_DATE_LABEL, useFormatDate } from './useFormatDate';

vitest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: 'fr_FR',
    },
  }),
}));

describe('useFormatDate', () => {
  it.each([
    {
      case: 'label for no date',
      input: 'invalid',
      dateString: undefined,
      format: undefined,
      expected: DEFAULT_UNKNOWN_DATE_LABEL,
    },
    {
      case: 'label for no date',
      input: 'empty',
      dateString: '',
      format: undefined,
      expected: DEFAULT_UNKNOWN_DATE_LABEL,
    },
    {
      case: 'a valid date',
      input: 'null',
      dateString: null,
      format: undefined,
      expected: 'N/A',
    },
    {
      case: 'a valid date with abbreviated month',
      input: 'valid',
      dateString: '2024-09-14T09:21:21.943Z',
      format: undefined,
      expected: '14 sept. 2024',
    },
    {
      case: 'a valid date with abbreviated month',
      input: 'valid',
      dateString: '2024-10-14T09:21:21.943Z',
      format: 'PP',
      expected: '14 oct. 2024',
    },
    {
      case: 'a valid date with non-abbreviated month',
      input: 'valid',
      dateString: '2024-09-14T09:21:21.943Z',
      format: 'PPP',
      expected: '14 septembre 2024',
    },
    {
      case: 'a valid date with compact format',
      input: 'valid and format is compact',
      dateString: '2024-06-14T09:21:21.943Z',
      format: 'P',
      expected: '14/06/2024',
    },
    {
      case: 'a valid date with compact format and time format (CEST)',
      input: 'valid and format is compact with time',
      dateString: '2024-06-14T09:21:21.943Z',
      format: 'Pp',
      expected: '14/06/2024, 09:21',
    },
    {
      case: 'a valid date with compact format and time format (CET)',
      input: 'valid and format is compact with time',
      dateString: '2024-01-14T09:21:21.943Z',
      format: 'Pp',
      expected: '14/01/2024, 09:21',
    },
    {
      case: 'a valid date with display format and time format (CET)',
      input: 'valid and format is compact with time',
      dateString: '2024-01-14T09:21:21.943Z',
      format: 'PPp',
      expected: '14 janv. 2024, 09:21',
    },
    {
      case: 'a valid date with full display format and time format (CET)',
      input: 'valid and format is compact with time',
      dateString: '2024-01-14T09:21:21.943Z',
      format: 'PPPpp',
      expected: '14 janvier 2024 à 09:21:21',
    },
  ])(
    'displays %s if the date is %s',
    async ({ dateString, format, expected }) => {
      const { result } = renderHook(() => useFormatDate());
      expect(result.current({ date: dateString || undefined, format })).toBe(
        expected,
      );
    },
  );
});
