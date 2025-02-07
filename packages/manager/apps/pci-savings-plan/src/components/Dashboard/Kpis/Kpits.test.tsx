import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Kpis from './Kpis';
import { useKpiData } from '@/hooks/useKpiData';
import { SavingsPlanFlavorConsumption } from '@/types/savingsPlanConsumption.type';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('@/hooks/useKpiData', () => ({
  useKpiData: vi.fn(),
}));

const dummyConsumption = {
  fees: { saved_amount: 100, total_price: 200 },
  subscriptions: [{}, {}],
  periods: [],
} as SavingsPlanFlavorConsumption;

const computedPercentsMock = {
  computedActivePlans: '2',
  computedUsagePercent: '50%',
  computedCoveragePercent: '60%',
  computedSavedAmount: '100.00',
  computedWithoutSavedAmount: '150.00',
};

describe('Kpis Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-01-15T00:00:00Z'));
    (useKpiData as any).mockReturnValue(computedPercentsMock);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.resetAllMocks();
  });

  it('should not render the saved amount KPI if the period is current', () => {
    const currentPeriod = 'janvier 2025';
    render(
      <Kpis
        isLoading={false}
        consumption={dummyConsumption}
        period={currentPeriod}
      />,
    );

    expect(screen.getByText('dashboard_kpis_active_plans_name')).toBeTruthy();
    expect(screen.getByText('dashboard_kpis_usage_percent_name')).toBeTruthy();
    expect(
      screen.getByText('dashboard_kpis_coverage_percent_name'),
    ).toBeTruthy();

    expect(screen.queryByText('dashboard_kpis_saved_amount_name')).toBeNull();
  });

  it('should render the saved amount KPI if the period is not current', () => {
    const nonCurrentPeriod = 'février 2025';
    render(
      <Kpis
        isLoading={false}
        consumption={dummyConsumption}
        period={nonCurrentPeriod}
      />,
    );

    expect(screen.getByText('dashboard_kpis_active_plans_name')).toBeTruthy();
    expect(screen.getByText('dashboard_kpis_usage_percent_name')).toBeTruthy();
    expect(
      screen.getByText('dashboard_kpis_coverage_percent_name'),
    ).toBeTruthy();
    expect(screen.getByText('dashboard_kpis_saved_amount_name')).toBeTruthy();
  });

  it('should display skeletons when isLoading is true', () => {
    const { container } = render(
      <Kpis
        isLoading={true}
        consumption={dummyConsumption}
        period="février 2025"
      />,
    );
    expect(container.querySelector('.h-16')).toBeTruthy();
  });
});
