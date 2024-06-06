import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

import { UseQueryResult } from '@tanstack/react-query';
import BackupLayout, {
  breadcrumb as Breadcrumb,
} from '@/pages/services/[serviceId]/settings/layout';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedService } from '@/__tests__/helpers/mocks/services';
import { database } from '@/models/database';

describe('Services Settings Layout', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.mock('@/pages/services/[serviceId]/layout', () => ({
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

  it('renders the BackupLayout component', async () => {
    render(<BackupLayout />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.getByTestId('location-display')).toBeInTheDocument();
    });
  });
});
