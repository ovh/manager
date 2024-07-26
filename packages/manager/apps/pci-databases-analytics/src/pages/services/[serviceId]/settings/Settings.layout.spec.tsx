import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

import { UseQueryResult } from '@tanstack/react-query';
import BackupLayout, {
  breadcrumb as Breadcrumb,
} from '@/pages/services/[serviceId]/settings/Settings.layout';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedService } from '@/__tests__/helpers/mocks/services';
import * as database from '@/types/cloud/project/database';

describe('Service settings layout', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
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

  it('renders the breadcrumb component', async () => {
    render(<Breadcrumb />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.getByText('breadcrumb')).toBeInTheDocument();
    });
  });

  it('renders the service layout component', async () => {
    render(<BackupLayout />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.getByTestId('location-display')).toBeInTheDocument();
    });
  });
});
