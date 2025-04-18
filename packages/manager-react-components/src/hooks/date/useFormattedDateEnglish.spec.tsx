import { renderHook } from '@testing-library/react';
import { vitest } from 'vitest';
import {
  useFormattedDate,
  defaultUnknownDateLabel,
  DateFormat,
  TimeFormat,
  useFormatDate,
} from './useFormattedDate';

vitest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: 'en-GB',
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
      expected: '1 Jan 1970',
    },
    {
      case: 'a valid date with abbreviated month',
      input: 'valid',
      dateString: '2024-09-14T09:21:21.943Z',
      format: undefined,
      expected: '14 Sept 2024',
    },
    {
      case: 'a valid date with abbreviated month',
      input: 'valid',
      dateString: '2024-10-14T09:21:21.943Z',
      format: DateFormat.display,
      expected: '14 Oct 2024',
    },
    {
      case: 'a valid date with non-abbreviated month',
      input: 'valid',
      dateString: '2024-09-14T09:21:21.943Z',
      format: DateFormat.fullDisplay,
      expected: '14 September 2024',
    },
    {
      case: 'a valid date with compact format',
      input: 'valid and format is compact',
      dateString: '2024-06-14T09:21:21.943Z',
      format: DateFormat.compact,
      expected: '14/06/2024',
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

describe('useFormatDate', () => {
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
      expected: 'N/A',
    },
    {
      case: 'a valid date with abbreviated month',
      input: 'valid',
      dateString: '2024-09-14T09:21:21.943Z',
      format: undefined,
      expected: '14 Sept 2024',
    },
    {
      case: 'a valid date with abbreviated month',
      input: 'valid',
      dateString: '2024-10-14T09:21:21.943Z',
      format: DateFormat.display,
      expected: '14 Oct 2024',
    },
    {
      case: 'a valid date with non-abbreviated month',
      input: 'valid',
      dateString: '2024-09-14T09:21:21.943Z',
      format: DateFormat.fullDisplay,
      expected: '14 September 2024',
    },
    {
      case: 'a valid date with compact format',
      input: 'valid and format is compact',
      dateString: '2024-06-14T09:21:21.943Z',
      format: DateFormat.compact,
      expected: '14/06/2024',
    },
    {
      case: 'a valid date with compact format and time format (CEST)',
      input: 'valid and format is compact with time',
      dateString: '2024-06-14T09:21:21.943Z',
      format: DateFormat.compact,
      timeFormat: TimeFormat.hourAndMinute,
      expected: '14/06/2024, 09:21',
    },
    {
      case: 'a valid date with compact format and time format (CET)',
      input: 'valid and format is compact with time',
      dateString: '2024-01-14T09:21:21.943Z',
      format: DateFormat.compact,
      timeFormat: TimeFormat.hourAndMinute,
      expected: '14/01/2024, 09:21',
    },
    {
      case: 'a valid date with display format and time format (CET)',
      input: 'valid and format is compact with time',
      dateString: '2024-01-14T09:21:21.943Z',
      format: DateFormat.display,
      timeFormat: TimeFormat.hourAndMinute,
      expected: '14 Jan 2024, 09:21',
    },
    {
      case: 'a valid date with full display format and time format (CET)',
      input: 'valid and format is compact with time',
      dateString: '2024-01-14T09:21:21.943Z',
      format: DateFormat.fullDisplay,
      timeFormat: TimeFormat.fullDisplay,
      expected: '14 January 2024 at 09:21:21',
    },
  ])(
    'displays %s if the date is %s',
    async ({ dateString, format, timeFormat, expected }) => {
      const { result } = renderHook(() => useFormatDate({}));
      expect(
        result.current.formatDate({ date: dateString, format, timeFormat }),
      ).toBe(expected);
    },
  );
});
