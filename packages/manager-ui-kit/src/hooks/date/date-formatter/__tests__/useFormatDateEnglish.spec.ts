import { renderHook } from '@testing-library/react';
import { changeLanguage } from 'i18next';

import { englishDates } from '@/commons/tests-utils/StaticData.constants';
import { useFormatDate } from '@/hooks/date/date-formatter/useFormatDate';

describe('useFormatDate', () => {
  beforeEach(async () => {
    await changeLanguage('en_GB');
  });

  it.each(englishDates)('displays %s if the date is %s', ({ dateString, format, expected }) => {
    const { result } = renderHook(() => useFormatDate({}));
    expect(result.current({ date: dateString || undefined, format })).toBe(expected);
  });
});
