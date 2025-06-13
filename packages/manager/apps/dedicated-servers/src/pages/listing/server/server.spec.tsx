import '@/test-utils/setupTests';
import '@testing-library/jest-dom';
import { describe, it, vi } from 'vitest';
import { useResourcesIcebergV6 } from '@ovh-ux/manager-react-components';
import { useNavigate } from 'react-router-dom';
import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';
import { screen, waitFor } from '@testing-library/react';
import { apiClient } from '@ovh-ux/manager-core-api';
import { urls } from '@/routes/routes.constant';
import { labels, renderTest } from '@/test-utils';
import serverFixture from '@/data/fixtures/server.json';

describe('server listing page', () => {
  it('should redirect to the onboarding page when the list is empty', async () => {
    (useResourcesIcebergV6 as ReturnType<typeof vi.fn>).mockReturnValue({
      flattenData: [],
      isLoading: false,
      isSuccess: true,
      isError: false,
      fetchNextPage: vi.fn(),
      totalCount: 0,
      hasNextPage: false,
      error: null,
      filters: [],
      search: vi.fn(),
    });
    ((apiClient.v6.get as unknown) as ReturnType<
      typeof vi.fn
    >).mockReturnValue({ data: [] });

    (useNavigate as ReturnType<typeof vi.fn>).mockReturnValue(vi.fn());

    await renderTest({ initialRoute: urls.server });
    await assertTextVisibility(
      labels.onboarding.dedicated_servers_onboarding_title,
    );
  });

  it('should render datagrid with result', async () => {
    (useResourcesIcebergV6 as ReturnType<typeof vi.fn>).mockReturnValue({
      flattenData: serverFixture,
      isLoading: false,
      isSuccess: true,
      isError: false,
      fetchNextPage: vi.fn(),
      totalCount: 0,
      hasNextPage: false,
      error: null,
      filters: [],
      search: vi.fn(),
    });

    (useNavigate as ReturnType<typeof vi.fn>).mockReturnValue(vi.fn());

    await renderTest({ initialRoute: urls.server });

    const headers = [
      labels.dedicated.server_display_name,
      labels.dedicated.server_display_price,
    ];

    headers.forEach(async (element) => assertTextVisibility(element));
    serverFixture.forEach((server) => assertTextVisibility(server.name));
  });

  it('should display an error banner when the API returns an error response', async () => {
    (useResourcesIcebergV6 as jest.Mock).mockReturnValue({
      flattenData: undefined,
      isLoading: false,
      isSuccess: false,
      isError: true,
      error: {
        response: {
          status: 500,
          headers: {},
        },
        message: 'Internal server error',
      },
    });

    (useNavigate as ReturnType<typeof vi.fn>).mockReturnValue(vi.fn());

    await renderTest({ initialRoute: urls.cluster });

    await waitFor(() => {
      expect(screen.getByText(/internal server error/i)).toBeInTheDocument();
    });
  });
});
