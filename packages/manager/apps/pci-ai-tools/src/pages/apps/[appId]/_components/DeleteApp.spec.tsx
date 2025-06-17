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
import { apiErrorMock } from '@/__tests__/helpers/mocks/shared/aiError';
import DeleteApp from './DeleteApp.component';
import { mockedApp } from '@/__tests__/helpers/mocks/app/app';

const onSuccess = vi.fn();
const onError = vi.fn();
describe('Delete app modal', () => {
  beforeEach(() => {
    vi.mock('@/data/api/ai/app/app.api', () => ({
      deleteApp: vi.fn(),
    }));
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should open the modal', async () => {
    render(<DeleteApp app={mockedApp} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.queryByTestId('delete-app-modal')).toBeTruthy();
    });
  });

  it('should delete the app on submit', async () => {
    render(<DeleteApp app={mockedApp} onSuccess={onSuccess} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    act(() => {
      fireEvent.click(screen.getByTestId('delete-app-submit-button'));
    });
    await waitFor(() => {
      expect(appApi.deleteApp).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'appToastSuccessTitle',
        description: 'deleteAppToastSuccessDescription',
      });
    });
    expect(onSuccess).toHaveBeenCalled();
  });

  it('should call onError when API fails', async () => {
    vi.mocked(appApi.deleteApp).mockImplementation(() => {
      throw apiErrorMock;
    });
    render(<DeleteApp app={mockedApp} onError={onError} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    act(() => {
      fireEvent.click(screen.getByTestId('delete-app-submit-button'));
    });
    await waitFor(() => {
      expect(appApi.deleteApp).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'appToastErrorTitle',
        description: apiErrorMock.response.data.message,
        variant: 'destructive',
      });
      expect(onError).toHaveBeenCalled();
    });
  });
});
