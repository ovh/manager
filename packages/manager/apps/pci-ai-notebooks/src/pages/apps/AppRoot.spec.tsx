import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import Root, { Loader } from '@/pages/apps/AppRoot.page';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import * as appApi from '@/data/api/ai/app/app.api';
import { mockedApp } from '@/__tests__/helpers/mocks/app/app';

const AppProps = {
  params: {
    projectId: 'projectId',
  },
  request: new Request('https://my-api.com/endpoint'),
};

describe('App Root page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    vi.mock('@/data/api/ai/app/app.api', () => ({
      getApps: vi.fn(() => []),
    }));
  });

  it('fetches app data', async () => {
    Loader(AppProps);
    await waitFor(() => {
      expect(appApi.getApps).toHaveBeenCalled();
    });
  });

  it('should display app page', async () => {
    vi.mocked(appApi.getApps).mockResolvedValue([mockedApp]);
    render(<Root />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('apps-guides-container')).toBeInTheDocument();
    });
  });
});
