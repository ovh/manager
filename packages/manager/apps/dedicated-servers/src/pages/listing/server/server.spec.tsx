import '@/test-utils/setupTests';
import '@testing-library/jest-dom';
import { describe, it, vi } from 'vitest';
import { useDataApi } from '@ovh-ux/muk';
import { useNavigate } from 'react-router-dom';
import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';
import { screen, waitFor } from '@testing-library/react';
import { apiClient } from '@ovh-ux/manager-core-api';
import { urls } from '@/routes/routes.constant';
import { labels, renderTest } from '@/test-utils';
import serverFixture from '@/data/fixtures/server.json';

describe('server listing page', () => {
  it('should redirect to the onboarding page when the list is empty', async () => {
    (useDataApi as jest.Mock).mockReturnValue({
      flattenData: [],
      hasNextPage: false,
      fetchNextPage: vi.fn(),
      isLoading: false,
      filters: {},
      sorting: {},
    });

    (apiClient.v6.get as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: [],
    });

    await renderTest({ initialRoute: urls.server });
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
      flattenData: serverFixture,
      hasNextPage: false,
      fetchNextPage: vi.fn(),
      isLoading: false,
      filters: {},
      sorting: {},
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

    await renderTest({ initialRoute: urls.server });

    const errorEl = await screen.findByTestId('error-component');
    expect(errorEl).toHaveTextContent(/internal server error/i);
  });
});
