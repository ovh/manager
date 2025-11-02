import { renderHook } from '@testing-library/react';
import { vitest } from 'vitest';

import { dates } from '@/commons/tests-utils/StaticData.constants';
import { DEFAULT_UNKNOWN_DATE_LABEL } from '@/hooks/date/date-formatter/FormatDate.type';
import { useFormatDate } from '@/hooks/date/date-formatter/useFormatDate';

vitest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: 'fr_FR',
    },
  }),
}));

describe('useFormatDate', () => {
  it.each(dates)('displays %s if the date is %s', ({ dateString, format, expected }) => {
    const { result } = renderHook(() => useFormatDate());
    expect(result.current({ date: dateString || undefined, format })).toBe(expected);
  });

  it('should return invalidDateDisplayLabel when formatDateFns throws an exception', () => {
    const customInvalidLabel = 'Custom Invalid Date';
    const { result } = renderHook(() =>
      useFormatDate({ invalidDateDisplayLabel: customInvalidLabel }),
    );

    // Test with an invalid format that might cause formatDateFns to throw
    const result1 = result.current({
      date: new Date('2024-01-14T09:21:21.943Z'),
      format: 'invalid-format',
    });
    expect(result1).toBe(customInvalidLabel);
  });

  it('should return default invalidDateDisplayLabel when formatDateFns throws an exception and no custom label provided', () => {
    const { result } = renderHook(() => useFormatDate());

    // Test with an invalid format that might cause formatDateFns to throw
    const result1 = result.current({
      date: new Date('2024-01-14T09:21:21.943Z'),
      format: 'invalid-format',
    });
    expect(result1).toBe(DEFAULT_UNKNOWN_DATE_LABEL);
  });
});
