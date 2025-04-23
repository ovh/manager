import { renderHook } from '@testing-library/react';
import { vitest } from 'vitest';
import {
  useFormattedDate,
  defaultUnknownDateLabel,
  DateFormat,
} from './useFormattedDate';

vitest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: 'en-US',
    },
  }),
}));

describe('useFormattedDate', () => {
  it.each([
    {
      case: 'label for no date',
      input: 'invalid',
      dateString: undefined,
      format: undefined,
      expected: defaultUnknownDateLabel,
    },
    {
      case: 'label for no date',
      input: 'empty',
      dateString: '',
      format: undefined,
      expected: defaultUnknownDateLabel,
    },
    {
      case: 'a valid date',
      input: 'null',
      dateString: null,
      format: undefined,
      expected: 'Jan 1, 1970',
    },
    {
      case: 'a valid date with abbreviated month',
      input: 'valid',
      dateString: '2024-09-14T09:21:21.943Z',
      format: undefined,
      expected: 'Sep 14, 2024',
    },
    {
      case: 'a valid date with abbreviated month',
      input: 'valid',
      dateString: '2024-10-14T09:21:21.943Z',
      format: DateFormat.display,
      expected: 'Oct 14, 2024',
    },
    {
      case: 'a valid date with non-abbreviated month',
      input: 'valid',
      dateString: '2024-09-14T09:21:21.943Z',
      format: DateFormat.fullDisplay,
      expected: 'September 14, 2024',
    },
    {
      case: 'a valid date with compact format',
      input: 'valid and format is compact',
      dateString: '2024-06-14T09:21:21.943Z',
      format: DateFormat.compact,
      expected: '6/14/2024',
    },
    {
      case: 'a valid date with compact format including time',
      input: 'valid and format is compact with time',
      dateString: '2024-06-14T18:21:21.943',
      format: DateFormat.compactWithTime,
      expected: '6/14/24, 6:21 PM',
    },
  ])(
    'displays %s if the date is %s',
    async ({ dateString, format, expected }) => {
      const { result } = renderHook(() =>
        useFormattedDate({ dateString, format }),
      );
      expect(result.current).toBe(expected);
    },
  );
});
