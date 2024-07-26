import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

import { UseQueryResult } from '@tanstack/react-query';
import MeanMetric from '@/pages/services/[serviceId]/dashboard/_components/MeanMetric.component';

import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockMetric } from '@/__tests__/helpers/mocks/metrics';
import { mockedService } from '@/__tests__/helpers/mocks/services';
import * as database from '@/types/cloud/project/database';

describe('Mean Metric component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    vi.mock('@/data/api/database/metric.api', () => ({
      getMetric: vi.fn(() => mockMetric),
    }));

    vi.mock('@/pages/services/[serviceId]/Service.context', () => ({
      useServiceData: vi.fn(() => ({
        projectId: 'projectId',
        service: mockedService,
        category: 'operational',
        serviceQuery: {} as UseQueryResult<database.Service, Error>,
      })),
    }));
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the skeleton component while loading', async () => {
    render(<MeanMetric metricName={mockMetric.name} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.getByTestId('mean-metric-skeleton')).toBeInTheDocument();
    });
  });
  it('displays mean metric value', async () => {
    render(<MeanMetric metricName={mockMetric.name} value={45} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.getByText('35.00%')).toBeInTheDocument();
    });
  });
});
