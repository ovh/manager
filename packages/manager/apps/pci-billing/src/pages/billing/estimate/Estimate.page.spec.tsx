import { describe, Mock, vi, expect } from 'vitest';
import { render } from '@testing-library/react';
import {
  EstimatePart,
  TEstimateProps,
} from '@/pages/billing/estimate/Estimate.part';
import EstimatePage from './Estimate.page';
import { AlertsPart, TAlertsPart } from '@/pages/billing/estimate/Alerts.part';
import { wrapper } from '@/wrapperRenders';

vi.mock('@/api/hooks/useAlerting', async () => ({
  useGetAlertIds: vi.fn().mockImplementation(() => ({
    data: [],
    isPending: false,
  })),
  useGetAlert: vi
    .fn()
    .mockImplementation(() => ({ data: null, isLoading: false })),

  useCreateAlert: vi.fn().mockImplementation(() => ({
    isPending: false,
  })),
  useUpdateAlert: vi.fn().mockImplementation(() => ({
    isPending: false,
  })),
  useDeleteAlert: vi.fn().mockImplementation(() => ({
    isPending: false,
  })),
}));

vi.mock('react-i18next', async () => {
  const { ...rest } = await vi.importActual('react-i18next');
  return {
    ...rest,
    i18n: {
      language: 'en',
    },
  };
});

vi.mock('@/hooks/useUsagePrice', async () => ({
  useUsagePrice: (_projectId: string, kind: 'forecast' | 'current') => ({
    data: {
      totalHourlyPrice: kind === 'current' ? 1 : 2,
      totalMonthlyPrice: kind === 'current' ? 1 : 2,
      totalPrice: kind === 'current' ? 2 : 4,
    },
    isPending: false,
    error: null,
  }),
}));

vi.mock('./Estimate.part', async () => ({
  EstimatePart: vi
    .fn()
    .mockImplementation(() => <div data-testid="estimate-part" />),
}));

vi.mock('./Alerts.part', async () => ({
  AlertsPart: vi
    .fn()
    .mockImplementation(() => <div data-testid="alerts-part" />),
}));

vi.mock('@/hooks/useEnvironment', () => ({
  useEnvironment: vi.fn().mockImplementation(() => ({
    getUser: () => ({
      currency: {
        symbol: '€',
        code: 'EUR',
        format: '€0,0.00',
      },
    }),
  })),
}));

const renderComponent = () => render(<EstimatePage />, { wrapper });

describe('EstimatePage', () => {
  it('should render', () => {
    const { container } = renderComponent();
    expect(container).toMatchSnapshot();
  });

  it('should render EstimatePart', () => {
    const { getByTestId } = renderComponent();
    expect(getByTestId('estimate-part')).toBeInTheDocument();

    const call = (EstimatePart as Mock).mock.lastCall?.[0] as TEstimateProps;

    expect(call.currency).toEqual({
      symbol: '€',
      code: 'EUR',
      format: '€0,0.00',
    });
    expect(call.totalHourlyPrice).toBe(2);
    expect(call.totalMonthlyPrice).toBe(2);
    expect(call.totalPrice).toBe(4);
    expect(call.isPending).toBe(false);
    expect(call.locale).toBe('enGB');
  });

  it('should render AlertsPart', () => {
    const { getByTestId } = renderComponent();
    expect(getByTestId('alerts-part')).toBeInTheDocument();

    const call = (AlertsPart as Mock).mock.lastCall[0] as TAlertsPart;

    expect(call.projectId).toBe('project-id');

    expect(call.currency).toEqual({
      symbol: '€',
      code: 'EUR',
      format: '€0,0.00',
    });

    expect(call.currentTotalHourlyPrice).toBe(1);
    expect(call.forecastTotalHourlyPrice).toBe(2);
    expect(call.currentPricesError).toBe(null);
    expect(call.isLoading).toBe(false);
  });

  describe('Create alert modal', () => {
    describe('Success', () => {
      it('should clear notifications', () => {});
      it('should show success message', () => {});
      it('should update cache', () => {});
    });
    describe('Failure', () => {
      it('should show error message', () => {});
    });
  });

  describe('Update alert modal', () => {
    describe('Success', () => {
      it('should clear notifications', () => {});
      it('should show success message', () => {});
      it('should update cache', () => {});
    });
    describe('Failure', () => {
      it('should show error message', () => {});
    });
  });

  describe('Delete alert modal', () => {
    describe('Success', () => {
      it('should clear notifications', () => {});
      it('should show success message', () => {});
      it('should update cache', () => {});
    });
    describe('Failure', () => {
      it('should clear notifications', () => {});
      it('should show error message', () => {});
    });
  });
});
