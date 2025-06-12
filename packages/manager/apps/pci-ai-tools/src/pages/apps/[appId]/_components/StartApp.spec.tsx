import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from '@testing-library/react';
import { useToast } from '@datatr-ux/uxlib';
import * as appApi from '@/data/api/ai/app/app.api';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedApp } from '@/__tests__/helpers/mocks/app/app';
import { apiErrorMock } from '@/__tests__/helpers/mocks/shared/aiError';
import StartApp from './StartApp.component';

describe('Start app modal', () => {
  beforeEach(() => {
    vi.mock('@/data/api/ai/app/app.api', () => ({
      getApps: vi.fn(() => [mockedApp]),
      startApp: vi.fn((app) => app),
    }));
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  const onSuccess = vi.fn();
  const onError = vi.fn();
  it('should open the modal', async () => {
    render(<StartApp app={mockedApp} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.queryByTestId('start-app-modal')).toBeTruthy();
    });
  });

  it('should start the app on submit', async () => {
    render(<StartApp app={mockedApp} onSuccess={onSuccess} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    act(() => {
      fireEvent.click(screen.getByTestId('start-app-submit-button'));
    });
    await waitFor(() => {
      expect(appApi.startApp).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'appToastSuccessTitle',
        description: 'startAppToastSuccessDescription',
      });
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('should call onError when API fails', async () => {
    vi.mocked(appApi.startApp).mockImplementation(() => {
      throw apiErrorMock;
    });
    render(<StartApp app={mockedApp} onError={onError} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    act(() => {
      fireEvent.click(screen.getByTestId('start-app-submit-button'));
    });
    await waitFor(() => {
      expect(appApi.startApp).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'appToastErrorTitle',
        description: apiErrorMock.response.data.message,
        variant: 'destructive',
      });
      expect(onError).toHaveBeenCalled();
    });
  });
});
