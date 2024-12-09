import { describe, it, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useGetUsageHistory, useUsageHistoryPeriod } from './useHistory';
import { wrapper } from '@/wrapperRenders';
import { getUsageHistory, getUsageHistoryPeriod } from '../data/history';
import { getCurrentUsage } from '../data/consumption';
import { getConsumptionDetails } from './useConsumption';

const mocks = vi.hoisted(() => ({
  billingDate: new Date(),
}));

vi.mock('../data/consumption', () => ({
  getCurrentUsage: vi.fn(() => ({
    monthlyUsage: 'monthlyUsage',
  })),
}));

vi.mock('../hook/useConsumption', () => ({
  getConsumptionDetails: vi.fn(() => ({ consumptionDetails: 'details' })),
}));

vi.mock('../data/history', () => ({
  getUsageHistory: vi.fn(() => ({
    monthlyUsage: 'monthlyHistoryUsage',
    usageHistory: 'usageHistory',
  })),
  getUsageHistoryPeriod: vi.fn(),
}));

vi.mock('../../components/history/useComputeDate.hook', () => ({
  useComputeDate: vi.fn(() => ({
    billingDate: mocks.billingDate,
  })),
}));

describe('useUsageHistoryPeriod', () => {
  it('calls getUsageHistoryPeriod', async () => {
    renderHook(() => useUsageHistoryPeriod('projectId', 'from', 'to'), {
      wrapper,
    });
    expect(getUsageHistoryPeriod).toHaveBeenCalledWith(
      'projectId',
      'from',
      'to',
    );
  });
});

describe('useGetUsageHistory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls getCurrentUsage is billing date has same month', async () => {
    renderHook(
      () =>
        useGetUsageHistory('projectId', {
          id: 'periodId',
          lastUpdate: 'lastUpdate',
          period: {
            from: new Date().toUTCString(),
            to: new Date().toUTCString(),
          },
        }),
      {
        wrapper,
      },
    );
    await waitFor(() => {
      expect(getUsageHistory).toHaveBeenCalledWith('projectId', 'periodId');
    });
    await waitFor(() => {
      expect(getCurrentUsage).toHaveBeenCalledWith('projectId');
    });
    await waitFor(() => {
      expect(getConsumptionDetails).toHaveBeenCalledWith({
        monthlyUsage: 'monthlyUsage',
        usageHistory: 'usageHistory',
      });
    });
  });

  it('doesnt call getCurrentUsage if billing date has a different month', async () => {
    mocks.billingDate = new Date(0);
    renderHook(
      () =>
        useGetUsageHistory('projectId', {
          id: 'periodId',
          lastUpdate: 'lastUpdate',
          period: {
            from: new Date(0).toUTCString(),
            to: new Date(0).toUTCString(),
          },
        }),
      {
        wrapper,
      },
    );
    await waitFor(() => {
      expect(getUsageHistory).toHaveBeenCalledWith('projectId', 'periodId');
    });
    await waitFor(() => {
      expect(getCurrentUsage).not.toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(getConsumptionDetails).toHaveBeenCalledWith({
        monthlyUsage: 'monthlyHistoryUsage',
        usageHistory: 'usageHistory',
      });
    });
  });
});
