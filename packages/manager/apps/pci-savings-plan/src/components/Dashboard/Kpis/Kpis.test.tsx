import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
  vi,
} from 'vitest';
import Kpis from './Kpis';
import { SavingsPlanFlavorConsumption } from '@/types/savingsPlanConsumption.type';
import { tMock } from '@/utils/test/setupTests';

vi.mock('@ovhcloud/ods-components/react', () => ({
  OdsText: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  OdsTooltip: ({ children, id }: { children: React.ReactNode; id: string }) => (
    <div data-testid={`tooltip-${id}`}>{children}</div>
  ),
  OdsIcon: ({ id, ...props }: { id: string; [key: string]: any }) => (
    <div data-testid={`icon-${id}`} {...props} />
  ),
  OdsSkeleton: () => <div data-testid="skeleton" />,
}));

vi.mock('@ovh-ux/manager-pci-common', () => ({
  usePricing: () => ({
    formatPrice: (
      fee: number,
      { decimals }: { decimals: number; unit: number },
    ) => fee.toFixed(decimals),
  }),
}));

describe('Kpis Component', () => {
  beforeAll(() => {
    vi.useFakeTimers();
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  beforeEach(() => {
    tMock.mockClear();
  });

  const consumption = {
    subscriptions: [1, 2],
    periods: [
      { utilization: '80%', coverage: '70%' },
      { utilization: '100%', coverage: '90%' },
    ],
    fees: {
      savedAmount: 50,
      totalPrice: 100,
    },
  } as SavingsPlanFlavorConsumption;

  const flavorOptions = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
  ];

  it('renders skeletons when loading', () => {
    vi.setSystemTime(new Date('2025-02-11T12:00:00Z'));
    render(
      <Kpis
        flavorOptions={flavorOptions}
        isLoading={true}
        consumption={consumption}
        period="2025-02-01"
      />,
    );
    expect(screen.getAllByTestId('skeleton')).toHaveLength(3);
  });

  it('renders KPIs without the saved amount when period is the current month', () => {
    vi.setSystemTime(new Date('2025-02-11T12:00:00Z'));
    render(
      <Kpis
        flavorOptions={flavorOptions}
        isLoading={false}
        consumption={consumption}
        period="2025-02-01"
      />,
    );

    expect(
      screen.getByText('dashboard_kpis_active_plans_name'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('dashboard_kpis_usage_percent_name'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('dashboard_kpis_coverage_percent_name'),
    ).toBeInTheDocument();

    expect(screen.queryByText('dashboard_kpis_saved_amount_name')).toBeNull();

    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('90 %')).toBeInTheDocument();
    expect(screen.getByText('80 %')).toBeInTheDocument();
  });

  it('calls the translation function with the expected keys', () => {
    vi.setSystemTime(new Date('2025-02-11T12:00:00Z'));
    render(
      <Kpis
        flavorOptions={flavorOptions}
        isLoading={false}
        consumption={consumption}
        period="2025-02-01"
      />,
    );
    expect(tMock).toHaveBeenCalledWith('dashboard_kpis_active_plans_name');
    expect(tMock).toHaveBeenCalledWith('dashboard_kpis_usage_percent_name');
    expect(tMock).toHaveBeenCalledWith('dashboard_kpis_coverage_percent_name');
  });
});
