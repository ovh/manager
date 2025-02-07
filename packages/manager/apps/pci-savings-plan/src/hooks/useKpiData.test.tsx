import { renderHook } from '@testing-library/react-hooks';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useKpiData } from './useKpiData';
import { getPercentValue } from '@/utils/kpi/utils';
import { SavingsPlanFlavorConsumption } from '@/types/savingsPlanConsumption.type';

vi.mock('@ovh-ux/manager-pci-common', () => ({
  usePricing: () => ({
    formatPrice: (
      value: number,
      { decimals }: { decimals: number; unit: number },
    ) => value.toFixed(decimals),
  }),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('@/utils/kpi/utils', () => ({
  getPercentValue: vi.fn(),
}));

describe('useKpiData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns default messages when there are no periods', () => {
    const consumption = {
      fees: { saved_amount: 100, total_price: 200 },
      periods: [] as string[],
      subscriptions: [] as unknown[],
    } as SavingsPlanFlavorConsumption;

    const { result } = renderHook(() => useKpiData(consumption));
    expect(result.current).toEqual({
      computedUsagePercent: 'dashboard_kpis_not_available',
      computedCoveragePercent: 'dashboard_kpis_not_available',
      computedActivePlans: 'dashboard_kpis_not_available',
      computedSavedAmount: 'dashboard_kpis_not_available',
      computedWithoutSavedAmount: null,
    });
  });

  it('computes KPI values when valid consumption data is provided', () => {
    const consumption = {
      fees: { saved_amount: 100, total_price: 200 },
      periods: ['2023-01'],
      subscriptions: [{}, {}],
    } as SavingsPlanFlavorConsumption;

    vi.mocked(getPercentValue).mockImplementation((cons, period: string) => {
      if (period === 'utilization') return '50%';
      if (period === 'coverage') return '60%';
      return null;
    });

    const { result } = renderHook(() => useKpiData(consumption));

    expect(result.current).toEqual({
      computedUsagePercent: '50%',
      computedCoveragePercent: '60%',
      computedActivePlans: 2,
      computedSavedAmount: '100.00',
      computedWithoutSavedAmount: '300.00',
    });
  });

  it('returns default message for negative saved amount', () => {
    const consumption = {
      fees: { saved_amount: -50, total_price: 200 },
      periods: ['2023-01'],
      subscriptions: [{}],
    } as SavingsPlanFlavorConsumption;

    vi.mocked(getPercentValue).mockImplementation((cons, period: string) => {
      if (period === 'utilization') return '40%';
      return undefined;
    });

    const { result } = renderHook(() => useKpiData(consumption));

    expect(result.current).toEqual({
      computedUsagePercent: '40%',
      computedCoveragePercent: 'dashboard_kpis_not_available',
      computedActivePlans: 1,
      computedSavedAmount: 'dashboard_kpis_not_available',
      computedWithoutSavedAmount: null,
    });
  });
});
