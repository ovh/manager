import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import HistoryResume from './HistoryResume.component';
import * as _useComputeDateHook from './useComputeDate.hook';

describe('HistoryResume', () => {
  vi.spyOn(_useComputeDateHook, 'useComputeDate').mockReturnValue({
    translationValues: {
      month: 'novembre',
      year: 2024,
      lastMonth: 'octobre',
      previousYear: 2024,
    },
    billingDate: new Date('2024-10-31T23:00:00.000Z'),
    nextMonthDate: new Date('2024-11-30T23:00:00.000Z'),
    prevMonthDate: new Date('2024-09-30T22:00:00.000Z'),
  });

  it('matches snapshot with truthy isPostPaidUsageBilling', () => {
    const { asFragment } = render(
      <HistoryResume totalPrice={2000} isPostPaidUsageBilling />,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('matches snapshot with falsy isPostPaidUsageBilling', () => {
    vi.spyOn(_useComputeDateHook, 'useComputeDate').mockReturnValue({
      translationValues: {
        month: 'novembre',
        year: 2024,
        lastMonth: 'octobre',
        previousYear: 2024,
      },
      billingDate: new Date('2024-10-31T23:00:00.000Z'),
      nextMonthDate: new Date('2024-11-30T23:00:00.000Z'),
      prevMonthDate: new Date('2024-09-30T22:00:00.000Z'),
    });

    const { asFragment } = render(
      <HistoryResume totalPrice={23} isPostPaidUsageBilling={false} />,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
