import { renderHook } from '@testing-library/react';
import {
  useFormattedDate,
  defaultUnknownDateLabel,
  DateFormat,
} from './useFormattedDate';

jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (key: string) => key,
      i18n: {
        language: 'fr-FR',
      },
    };
  },
}));

describe('useFormattedDate', () => {
  it.each([
    [
      'label for no date',
      'invalid',
      undefined,
      undefined,
      defaultUnknownDateLabel,
    ],
    ['label for no date', 'empty', '', undefined, defaultUnknownDateLabel],
    ['a valid date', 'null', null, undefined, '1 janv. 1970'],
    [
      'a valid date with abbreviated month',
      'valid',
      '2024-09-14T09:21:21.943Z',
      undefined,
      '14 sept. 2024',
    ],
    [
      'a valid date with abbreviated month',
      'valid',
      '2024-10-14T09:21:21.943Z',
      DateFormat.display,
      '14 oct. 2024',
    ],
    [
      'a valid date with non-abbreviated month',
      'valid',
      '2024-09-14T09:21:21.943Z',
      DateFormat.fullDisplay,
      '14 septembre 2024',
    ],
    [
      'a valid date with compact format',
      'valid and format is compact',
      '2024-06-14T09:21:21.943Z',
      DateFormat.compact,
      '14/06/2024',
    ],
  ])(
    'displays %s if the date is %s',
    async (label1, label2, dateString, format, expected) => {
      const { result } = renderHook(() =>
        useFormattedDate({ dateString, format }),
      );
      expect(result.current).toBe(expected);
    },
  );
});
