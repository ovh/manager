import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { useToast } from '@datatr-ux/uxlib';
import { UseQueryResult } from '@tanstack/react-query';
import ai from '@/types/AI';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockManagerReactShellClient } from '@/__tests__/helpers/mockShellHelper';
import * as appApi from '@/data/api/ai/app/app.api';
import { apiErrorMock } from '@/__tests__/helpers/mocks/shared/aiError';
import { mockedApp } from '@/__tests__/helpers/mocks/app/app';
import UpdateImage from './UpdateCustomImage.modal';

describe('Update Custom image', () => {
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

  it('renders Update Custom Image modal and close it', async () => {
    render(<UpdateImage />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('update-image-modal')).toBeTruthy();
    expect(screen.getByTestId('update-image-input')).toBeTruthy();
    act(() => {
      fireEvent.click(screen.getByTestId('update-image-cancel-button'));
    });
    await waitFor(() => {
      expect(screen.queryByTestId('update-image-modal')).toBeNull();
    });
  });

  it('trigger onError on API Error', async () => {
    vi.mocked(appApi.updateApp).mockImplementation(() => {
      throw apiErrorMock;
    });
    render(<UpdateImage />, { wrapper: RouterWithQueryClientWrapper });
    act(() => {
      fireEvent.change(screen.getByTestId('update-image-input'), {
        target: {
          value: 'nmyNewWonderfullImage',
        },
      });
      fireEvent.click(screen.getByTestId('update-image-submit-button'));
    });
    await waitFor(() => {
      expect(appApi.updateApp).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'updateImageToastErrorTitle',
        description: apiErrorMock.response.data.message,
        variant: 'destructive',
      });
    });
  });

  it('trigger onSuccess on summit click', async () => {
    render(<UpdateImage />, { wrapper: RouterWithQueryClientWrapper });
    act(() => {
      fireEvent.change(screen.getByTestId('update-image-input'), {
        target: {
          value: 'nmyNewWonderfullImage',
        },
      });
      fireEvent.click(screen.getByTestId('update-image-submit-button'));
    });
    await waitFor(() => {
      expect(appApi.updateApp).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'updateImageToastSuccessTitle',
        description: 'updateImageToastSuccessDescription',
      });
    });
  });
});
