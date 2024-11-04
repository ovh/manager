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
      language: 'fr-FR',
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
      expected: '1 janv. 1970',
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
      format: DateFormat.display,
      expected: '14 oct. 2024',
    },
    {
      case: 'a valid date with non-abbreviated month',
      input: 'valid',
      dateString: '2024-09-14T09:21:21.943Z',
      format: DateFormat.fullDisplay,
      expected: '14 septembre 2024',
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
