
import '@/common/setupTests';
import React from 'react';
import { render, screen, wrapper } from '@/common/utils/test.provider';
import { describe, expect, it, vi, beforeEach, Mock } from 'vitest';
import DatagridColumnRenewFrequency from './DatagridColumnRenewFrequency';
import { useGetServiceInformation } from '@/common/hooks/data/query';
import { ServiceInfoRenewModeEnum } from '@/common/enum/common.enum';

vi.mock('@/common/hooks/data/query', () => ({
  useGetServiceInformation: vi.fn(),
}));

vi.mock('react-i18next', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-i18next')>();
  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string, options?: { years?: string }) => {
        if (
          key ===
          'domain_tab_general_information_subscription_renew_frequency_year'
        ) {
          return 'Yearly';
        }
        if (
          key ===
          'domain_tab_general_information_subscription_renew_frequency_years'
        ) {
          return `Every ${options?.years} years`;
        }
        if (
          key ===
          'domain_tab_general_information_subscription_renew_frequency_none'
        ) {
          return 'None';
        }
        if (
          key ===
          'domain_tab_general_information_subscription_manual_renew_tooltip'
        ) {
          return 'Manual renewal tooltip';
        }
        return key;
      },
    }),
  };
});


describe('DatagridColumnRenewFrequency', () => {
  const mockServiceName = 'test-domain.com';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading skeleton when service info is loading', () => {
    (useGetServiceInformation as Mock).mockReturnValue({
      serviceInfo: null,
      isServiceInfoLoading: true,
    });

    render(<DatagridColumnRenewFrequency serviceName={mockServiceName} />, {
      wrapper,
    });

    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
  });

  it('should render empty when no service info', () => {
    (useGetServiceInformation as Mock).mockReturnValue({
      serviceInfo: null,
      isServiceInfoLoading: false,
    });

    render(<DatagridColumnRenewFrequency serviceName={mockServiceName} />, {
      wrapper,
    });

    expect(screen.queryByTestId('datagrid-text-cell')).not.toBeInTheDocument();
  });

  it('should render renew frequency for 1 year period', () => {
    const mockServiceInfo = {
      billing: {
        renew: {
          current: {
            period: 'P1Y',
            mode: ServiceInfoRenewModeEnum.Automatic,
          },
        },
      },
    };

    (useGetServiceInformation as Mock).mockReturnValue({
      serviceInfo: mockServiceInfo,
      isServiceInfoLoading: false,
    });

    render(<DatagridColumnRenewFrequency serviceName={mockServiceName} />, {
      wrapper,
    });

    const textCell = screen.getByTestId('datagrid-text-cell');
    expect(textCell).toBeInTheDocument();
    expect(textCell).toHaveTextContent('Yearly');
  });

  it('should render renew frequency for multiple years period', () => {
    const mockServiceInfo = {
      billing: {
        renew: {
          current: {
            period: 'P3Y',
            mode: ServiceInfoRenewModeEnum.Automatic,
          },
        },
      },
    };

    (useGetServiceInformation as Mock).mockReturnValue({
      serviceInfo: mockServiceInfo,
      isServiceInfoLoading: false,
    });

    render(<DatagridColumnRenewFrequency serviceName={mockServiceName} />, {
      wrapper,
    });

    const textCell = screen.getByTestId('datagrid-text-cell');
    expect(textCell).toBeInTheDocument();
    expect(textCell).toHaveTextContent('Every 3 years');
  });

  it('should render "none" for invalid or empty period', () => {
    const mockServiceInfo = {
      billing: {
        renew: {
          current: {
            period: 'invalid-period',
            mode: ServiceInfoRenewModeEnum.Automatic,
          },
        },
      },
    };

    (useGetServiceInformation as Mock).mockReturnValue({
      serviceInfo: mockServiceInfo,
      isServiceInfoLoading: false,
    });

    render(<DatagridColumnRenewFrequency serviceName={mockServiceName} />, {
      wrapper,
    });

    const textCell = screen.getByTestId('datagrid-text-cell');
    expect(textCell).toBeInTheDocument();
    expect(textCell).toHaveTextContent('None');
  });

  it('should show manual renew tooltip for manual mode', () => {
    const mockServiceInfo = {
      billing: {
        renew: {
          current: {
            period: 'P1Y',
            mode: ServiceInfoRenewModeEnum.Manual,
          },
        },
      },
    };

    (useGetServiceInformation as Mock).mockReturnValue({
      serviceInfo: mockServiceInfo,
      isServiceInfoLoading: false,
    });

    render(<DatagridColumnRenewFrequency serviceName={mockServiceName} />, {
      wrapper,
    });

    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip-trigger')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip-content')).toBeInTheDocument();
    expect(screen.getByTestId('question-circle-icon-Manual renewal tooltip')).toBeInTheDocument();
  });

  it('should not show tooltip for automatic mode', () => {
    const mockServiceInfo = {
      billing: {
        renew: {
          current: {
            period: 'P1Y',
            mode: ServiceInfoRenewModeEnum.Automatic,
          },
        },
      },
    };

    (useGetServiceInformation as Mock).mockReturnValue({
      serviceInfo: mockServiceInfo,
      isServiceInfoLoading: false,
    });

    render(<DatagridColumnRenewFrequency serviceName={mockServiceName} />, {
      wrapper,
    });

    expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('icon-circle-question'),
    ).not.toBeInTheDocument();
  });

  it('should handle missing period gracefully', () => {
    const mockServiceInfo = {
      billing: {
        renew: {
          current: {
            period: null as string | null,
            mode: ServiceInfoRenewModeEnum.Automatic,
          },
        },
      },
    };

    (useGetServiceInformation as Mock).mockReturnValue({
      serviceInfo: mockServiceInfo,
      isServiceInfoLoading: false,
    });

    render(<DatagridColumnRenewFrequency serviceName={mockServiceName} />, {
      wrapper,
    });

    const textCell = screen.getByTestId('datagrid-text-cell');
    expect(textCell).toBeInTheDocument();
    expect(textCell).toHaveTextContent('None');
  });

  it('should parse period correctly for different year values', () => {
    const testCases = [
      { period: 'P1Y', expected: 'Yearly' },
      { period: 'P2Y', expected: 'Every 2 years' },
      { period: 'P5Y', expected: 'Every 5 years' },
      { period: 'P10Y', expected: 'Every 10 years' },
    ];

    testCases.forEach(({ period, expected }) => {
      const mockServiceInfo = {
        billing: {
          renew: {
            current: {
              period,
              mode: ServiceInfoRenewModeEnum.Automatic,
            },
          },
        },
      };

      (useGetServiceInformation as Mock).mockReturnValue({
        serviceInfo: mockServiceInfo,
        isServiceInfoLoading: false,
      });

      const { unmount } = render(
        <DatagridColumnRenewFrequency serviceName={mockServiceName} />,
        {
          wrapper,
        },
      );

      const textCell = screen.getByTestId('datagrid-text-cell');
      expect(textCell).toBeInTheDocument();

      expect(textCell).toHaveTextContent(expected);
      unmount();
    });
  });
});
