import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import HistoryHeader from './HistoryHeader.component';
import * as _useComputeDateHook from './useComputeDate.hook';
import { wrapper } from '@/wrapperRenders';

describe('HistoryHeader', () => {
  vi.spyOn(_useComputeDateHook, 'useComputeDate').mockReturnValue({
    translationValues: {
      month: 'novembre',
      year: 2023,
      lastMonth: 'octobre',
      previousYear: 2023,
    },
    billingDate: new Date('2023-10-31T23:00:00.000Z'),
    nextMonthDate: new Date('2023-11-30T23:00:00.000Z'),
    prevMonthDate: new Date('2023-09-30T22:00:00.000Z'),
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<HistoryHeader />, { wrapper });

    expect(asFragment()).toMatchSnapshot();
  });
});
