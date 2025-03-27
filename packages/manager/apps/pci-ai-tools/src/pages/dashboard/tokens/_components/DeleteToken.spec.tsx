import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { useToast } from '@datatr-ux/uxlib';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import * as tokensApi from '@/data/api/ai/token/token.api';
import { mockedToken } from '@/__tests__/helpers/mocks/shared/token';
import { apiErrorMock } from '@/__tests__/helpers/mocks/shared/aiError';
import DeleteToken from './DeleteToken.modal';

describe('DeleteToken modal', () => {
  beforeEach(() => {
    vi.mock('@/data/api/ai/token/token.api', () => ({
      deleteToken: vi.fn(),
      getToken: vi.fn(() => mockedToken),
    }));
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders skeleton while loading', async () => {
    render(<DeleteToken />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('dialog-container')).toBeTruthy();
    });
  });

  it('open and close delete token modal', async () => {
    render(<DeleteToken />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('delete-token-modal')).toBeTruthy();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('delete-token-cancel-button'));
    });
    await waitFor(() => {
      expect(screen.queryByTestId('delete-token-modal')).toBeNull();
    });
  });

  it('display error on delete token error', async () => {
    const errorMsg = {
      description: 'api error message',
      title: 'deleteTokenToastErrorTitle',
      variant: 'destructive',
    };
    vi.mocked(tokensApi.deleteToken).mockImplementationOnce(() => {
      throw apiErrorMock;
    });
    render(<DeleteToken />, { wrapper: RouterWithQueryClientWrapper });
    act(() => {
      fireEvent.click(screen.getByTestId('delete-token-submit-button'));
    });
    await waitFor(() => {
      expect(tokensApi.deleteToken).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith(errorMsg);
    });
  });

  it('refetch data on delete token success', async () => {
    render(<DeleteToken />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('delete-token-modal')).toBeTruthy();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('delete-token-submit-button'));
    });
    await waitFor(() => {
      expect(tokensApi.deleteToken).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'deleteTokenToastSuccessTitle',
        description: 'deleteTokenToastSuccessDescription',
      });
    });
  });
});
