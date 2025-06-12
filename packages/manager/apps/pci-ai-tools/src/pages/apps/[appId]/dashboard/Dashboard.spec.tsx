import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { UseQueryResult } from '@tanstack/react-query';
import { useToast } from '@datatr-ux/uxlib';
import ai from '@/types/AI';
import { mockedCommand } from '@/__tests__/helpers/mocks/shared/command';
import { mockManagerReactShellClient } from '@/__tests__/helpers/mockShellHelper';
import Dashboard from './Dashboard.page';
import * as appApi from '@/data/api/ai/app/app.api';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { apiErrorMock } from '@/__tests__/helpers/mocks/shared/aiError';
import { mockedApp, mockedAppSpec } from '@/__tests__/helpers/mocks/app/app';

const mockedAppBis: ai.app.App = {
  ...mockedApp,
  spec: {
    ...mockedAppSpec,
    labels: { key: 'label' },
  },
};

describe('Dashboard page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockManagerReactShellClient();

    vi.mock('@/data/api/ai/app/app.api', () => ({
      getCommand: vi.fn(() => mockedCommand),
    }));

    vi.mock('@/pages/apps/[appId]/App.context', () => ({
      useAppData: vi.fn(() => ({
        projectId: 'projectId',
        app: mockedAppBis,
        appQuery: {} as UseQueryResult<ai.app.App, Error>,
      })),
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders Dashboard', async () => {
    render(<Dashboard />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('dashboard-container')).toBeTruthy();
  });

  it('renders Dashboard with toast error on API Error', async () => {
    vi.mocked(appApi.getCommand).mockImplementation(() => {
      throw apiErrorMock;
    });
    render(<Dashboard />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('dashboard-container')).toBeTruthy();
    await waitFor(() => {
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'errorGetCommandCli',
        description: apiErrorMock.response.data.message,
        variant: 'destructive',
      });
    });
  });
});
