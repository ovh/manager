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
import * as appApi from '@/data/api/ai/app/app.api';
import { apiErrorMock } from '@/__tests__/helpers/mocks/shared/aiError';
import { mockedApp } from '@/__tests__/helpers/mocks/app/app';
import UpdateHttpPort from './UpdateHttpPort.modal';

describe('Update Port', () => {
  beforeEach(() => {
    vi.restoreAllMocks();

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

  it('renders Update port modal and close it', async () => {
    render(<UpdateHttpPort />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('update-port-modal')).toBeTruthy();
    expect(screen.getByTestId('update-port-input')).toBeTruthy();
    act(() => {
      fireEvent.click(screen.getByTestId('update-port-cancel-button'));
    });
    await waitFor(() => {
      expect(screen.queryByTestId('update-port-modal')).toBeNull();
    });
  });

  it('trigger onError on API Error', async () => {
    vi.mocked(appApi.updateApp).mockImplementation(() => {
      throw apiErrorMock;
    });
    render(<UpdateHttpPort />, { wrapper: RouterWithQueryClientWrapper });
    act(() => {
      fireEvent.change(screen.getByTestId('update-port-input'), {
        target: {
          value: 9090,
        },
      });
      fireEvent.click(screen.getByTestId('update-port-submit-button'));
    });
    await waitFor(() => {
      expect(appApi.updateApp).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'updatePortToastErrorTitle',
        description: apiErrorMock.response.data.message,
        variant: 'destructive',
      });
    });
  });

  it('trigger onSuccess on summit click', async () => {
    render(<UpdateHttpPort />, { wrapper: RouterWithQueryClientWrapper });
    act(() => {
      fireEvent.change(screen.getByTestId('update-port-input'), {
        target: {
          value: 9090,
        },
      });
      fireEvent.click(screen.getByTestId('update-port-submit-button'));
    });
    await waitFor(() => {
      expect(appApi.updateApp).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'updatePortToastSuccessTitle',
        description: 'updatePortToastSuccessDescription',
      });
    });
  });
});
