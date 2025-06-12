import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { UseQueryResult } from '@tanstack/react-query';
import { useToast } from '@datatr-ux/uxlib';
import ai from '@/types/AI';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockManagerReactShellClient } from '@/__tests__/helpers/mockShellHelper';
import * as appApi from '@/data/api/ai/app/app.api';
import { apiErrorMock } from '@/__tests__/helpers/mocks/shared/aiError';
import { mockedApp } from '@/__tests__/helpers/mocks/app/app';
import UpdateDockerCommand from './UpdateDockerCommand.modal';

describe('Update Docker command', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockManagerReactShellClient();
    vi.mock('@/pages/apps/[appId]/App.context', () => ({
      useAppData: vi.fn(() => ({
        projectId: 'projectId',
        app: mockedApp,
        appQuery: {} as UseQueryResult<ai.app.App, Error>,
      })),
    }));

    vi.mock('@/data/api/ai/app/app.api', () => ({
      updateApp: vi.fn(() => mockedApp),
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders Update Docker command modal and close it', async () => {
    render(<UpdateDockerCommand />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('update-docker-command-modal')).toBeTruthy();
    expect(screen.getByTestId('command-input-field')).toBeTruthy();
    act(() => {
      fireEvent.click(screen.getByTestId('update-resources-cancel-button'));
    });
    await waitFor(() => {
      expect(screen.queryByTestId('update-docker-command-modal')).toBeNull();
    });
  });

  it('trigger onError on API Error', async () => {
    vi.mocked(appApi.updateApp).mockImplementation(() => {
      throw apiErrorMock;
    });
    render(<UpdateDockerCommand />, { wrapper: RouterWithQueryClientWrapper });
    act(() => {
      fireEvent.change(screen.getByTestId('command-input-field'), {
        target: {
          value: 'my new docker command',
        },
      });
      fireEvent.click(screen.getByTestId('update-resources-submit-button'));
    });
    await waitFor(() => {
      expect(appApi.updateApp).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'updateDockerToastErrorTitle',
        description: apiErrorMock.response.data.message,
        variant: 'destructive',
      });
    });
  });

  it('trigger onSuccess on summit click', async () => {
    render(<UpdateDockerCommand />, { wrapper: RouterWithQueryClientWrapper });
    act(() => {
      fireEvent.change(screen.getByTestId('command-input-field'), {
        target: {
          value: 'my new Docker command',
        },
      });
      fireEvent.click(screen.getByTestId('update-resources-submit-button'));
    });
    await waitFor(() => {
      expect(appApi.updateApp).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'updateDockerToastSuccessTitle',
        description: 'updateDockerToastSuccessDescription',
      });
    });
  });
});
