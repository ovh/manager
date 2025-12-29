import '@/test-utils/setupTests';
import '@testing-library/jest-dom';
import { describe, it, vi } from 'vitest';
import { useDataApi } from '@ovh-ux/muk';
import { useNavigate } from 'react-router-dom';
import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';
import { screen, waitFor } from '@testing-library/react';
import { urls } from '@/routes/routes.constant';
import { labels, renderTest } from '@/test-utils';
import clustersFixture from '@/data/fixtures/clusters.json';

describe('cluster listing page', () => {
  it('should redirect to the onboarding page when the list is empty', async () => {
    (useDataApi as jest.Mock).mockReturnValue({
      flattenData: [],
      hasNextPage: false,
      fetchNextPage: vi.fn(),
      isLoading: false,
      filters: {},
      sorting: {},
    });

    // (apiClient.v6.get as ReturnType<typeof vi.fn>).mockResolvedValue({
    //   data: [],
    // });

    await renderTest({ initialRoute: urls.cluster });
    await waitFor(
      () => {
        const el = document.querySelector(
          '[aria-labelledby="onboarding-title"]',
        );
        expect(el).toBeInTheDocument();
      },
      { timeout: 5000 },
    );
  });

  it('should render datagrid with result', async () => {
    (useDataApi as ReturnType<typeof vi.fn>).mockReturnValue({
      flattenData: clustersFixture,
      hasNextPage: false,
      fetchNextPage: vi.fn(),
      isLoading: false,
      filters: {},
      sorting: {},
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
    (useDataApi as jest.Mock).mockReturnValue({
      flattenData: undefined,
      hasNextPage: false,
      fetchNextPage: vi.fn(),
      isLoading: false,
      filters: {},
      sorting: {},
      isError: true,
      error: new Error('Internal Server Error'),
    });

    (useNavigate as ReturnType<typeof vi.fn>).mockReturnValue(vi.fn());

    await renderTest({ initialRoute: urls.cluster });

    await waitFor(() => {
      expect(screen.getByText(/internal server error/i)).toBeInTheDocument();
    });
  });
});
