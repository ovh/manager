import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import * as tokensApi from '@/data/api/ai/token.api';
import { mockedToken } from '@/__tests__/helpers/mocks/shared/token';
import { apiErrorMock } from '@/__tests__/helpers/mocks/shared/aiError';
import { useToast } from '@/components/ui/use-toast';
import RenewToken from './RenewToken.modal';

describe('RenewToken modal', () => {
  beforeEach(() => {
    vi.mock('@/data/api/ai/token.api', () => ({
      getToken: vi.fn(() => mockedToken),
      renewToken: vi.fn(() => mockedToken),
    }));
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders skeleton while loading', async () => {
    render(<RenewToken />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('dialog-container')).toBeInTheDocument();
    });
  });

  it('open and close renew token modal', async () => {
    render(<RenewToken />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('renew-token-modal')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('renew-token-cancel-button'));
    });
    await waitFor(() => {
      expect(screen.queryByTestId('renew-token-modal')).not.toBeInTheDocument();
    });
  });

  it('display error on renew token error', async () => {
    const errorMsg = {
      description: 'api error message',
      title: 'renewTokenToastErrorTitle',
      variant: 'destructive',
    };
    vi.mocked(tokensApi.renewToken).mockImplementationOnce(() => {
      throw apiErrorMock;
    });
    render(<RenewToken />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('renew-token-modal')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('renew-token-submit-button'));
    });
    await waitFor(() => {
      expect(tokensApi.renewToken).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith(errorMsg);
    });
  });

  it('renders renewToken modal, and display token, copy it and close the modal', async () => {
    Object.assign(window.navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    });
    const successMsg = {
      description: 'renewTokenToastSuccessDescription',
      title: 'renewTokenToastSuccessTitle',
    };
    render(<RenewToken />, { wrapper: RouterWithQueryClientWrapper });
    act(() => {
      fireEvent.click(screen.getByTestId('renew-token-submit-button'));
    });
    await waitFor(() => {
      expect(tokensApi.renewToken).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith(successMsg);
    });
    await waitFor(() => {
      expect(screen.getByTestId('renew-token-copy-button')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('renew-token-copy-button'));
    });
    await waitFor(() => {
      expect(window.navigator.clipboard.writeText).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalled();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('renew-token-close-button'));
    });
    await waitFor(() => {
      expect(screen.queryByTestId('renew-token-modal')).not.toBeInTheDocument();
    });
  });
});
