import { vi, expect, it, describe } from 'vitest';
import { renderHook } from '@testing-library/react-hooks';
import { useFormattedDate } from './date';

vi.mock('react-i18next', () => ({
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
    ['label for no date', 'invalid', undefined, 'unknown_date'],
    ['label for no date', 'empty', '', 'unknown_date'],
    ['a valid date', 'null', null, '1 janv. 1970'],
    ['a valid date', 'valid', '2024-06-14T09:21:21.943Z', '14 juin 2024'],
  ])(
    'displays %s if the date is %s',
    (label1, label2, datestring, expected) => {
      const { result } = renderHook(() => useFormattedDate(datestring));
      expect(result.current).toBe(expected);
    },
  );
});
