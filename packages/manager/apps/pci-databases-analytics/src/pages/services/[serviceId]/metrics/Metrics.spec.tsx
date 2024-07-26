import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { UseQueryResult } from '@tanstack/react-query';
import Metrics, {
  breadcrumb as Breadcrumb,
} from '@/pages/services/[serviceId]/metrics/Metrics.page';
import * as database from '@/types/cloud/project/database';
import { Locale } from '@/hooks/useLocale';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedService as mockedServiceOrig } from '@/__tests__/helpers/mocks/services';
import {
  mockMetric,
  mockMetricCpu,
  mockMetricDisk,
  mockMetricMem,
} from '@/__tests__/helpers/mocks/metrics';

describe('Metrics page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    // Mock necessary hooks and dependencies
    vi.mock('react-i18next', () => ({
      useTranslation: () => ({
        t: (key: string) => key,
      }),
    }));

    vi.mock('@/data/api/database/metric.api', () => ({
      getMetrics: vi.fn(() => [
        mockMetric.name,
        mockMetricCpu.name,
        mockMetricDisk.name,
        mockMetricMem.name,
      ]),
      getMetric: vi.fn(() => mockMetric),
    }));

    vi.mock('@/pages/services/[serviceId]/Service.context', () => ({
      useServiceData: vi.fn(() => ({
        projectId: 'projectId',
        service: mockedServiceOrig,
        category: 'operational',
        serviceQuery: {} as UseQueryResult<database.Service, Error>,
      })),
    }));

    vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
      const mod = await importOriginal<
        typeof import('@ovh-ux/manager-react-shell-client')
      >();
      return {
        ...mod,
        useShell: vi.fn(() => ({
          i18n: {
            getLocale: vi.fn(() => Locale.fr_FR),
            onLocaleChange: vi.fn(),
            setLocale: vi.fn(),
          },
        })),
      };
    });

    vi.mock('/chart.js', () => ({
      Chart: vi.fn(() => null),
    }));

    vi.mock('react-chartjs-2', () => ({
      Line: vi.fn(() => null),
    }));
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the breadcrumb component', async () => {
    const translationKey = 'breadcrumb';
    render(<Breadcrumb />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(translationKey)).toBeInTheDocument();
    });
  });

  it('renders and shows skeletons while loading', async () => {
    render(<Metrics />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText('Loading')).toBeInTheDocument();
    });
  });

  it('renders and shows metrics table', async () => {
    render(<Metrics />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(
        screen.queryByTestId('metric-chart-loading-container'),
      ).not.toBeInTheDocument();
      const periodButton = screen.getAllByTestId('manage-period-button');
      expect(periodButton.length).toBeGreaterThan(0);
      expect(
        screen.getByTestId('swith-auto-refresh-container'),
      ).toBeInTheDocument();
      const chartContainer = screen.getAllByTestId('metric-chart-container');
      expect(chartContainer.length).toBeGreaterThan(0);
    });
  });
});
