import '@/test-utils/setupTests';
import '@testing-library/jest-dom';
import { describe, it, vi } from 'vitest';
import { useResourcesIcebergV6 } from '@ovh-ux/manager-react-components';
import { useNavigate } from 'react-router-dom';
import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';
import { screen, waitFor } from '@testing-library/react';
import { urls } from '@/routes/routes.constant';
import { labels, renderTest } from '@/test-utils';
import clustersFixture from '@/data/fixtures/clusters.json';

describe('cluster listing page', () => {
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

    (useNavigate as ReturnType<typeof vi.fn>).mockReturnValue(vi.fn());

    await renderTest({ initialRoute: urls.cluster });
    await assertTextVisibility(
      labels.onboarding.dedicated_servers_onboarding_title,
    );
  });

  it('should render datagrid with result', async () => {
    (useResourcesIcebergV6 as ReturnType<typeof vi.fn>).mockReturnValue({
      flattenData: clustersFixture,
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

    await renderTest({ initialRoute: urls.cluster });

    const headers = [
      labels.cluster.dedicated_clusters_name,
      labels.cluster.dedicated_clusters_model,
      labels.cluster.dedicated_clusters_region,
    ];

    headers.forEach((element) => assertTextVisibility(element));
    clustersFixture.forEach((cluster) => assertTextVisibility(cluster.id));
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
