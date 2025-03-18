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
import { apiErrorMock } from '@/__tests__/helpers/mocks/shared/aiError';
import { mockedToken } from '@/__tests__/helpers/mocks/shared/token';
import AddToken from './AddToken.modal';
import { mockedCapabilitiesRegionGRA } from '@/__tests__/helpers/mocks/capabilities/region';
import { handleSelectOption } from '@/__tests__/helpers/unitTestHelper';

describe('AddToken modal', () => {
  beforeEach(() => {
    vi.mock('@/data/api/ai/token/token.api', () => ({
      addToken: vi.fn(() => mockedToken),
    }));

    vi.mock('@/data/api/ai/capabilities/capabilities.api', () => ({
      getRegions: vi.fn(() => [mockedCapabilitiesRegionGRA]),
    }));
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('open and close add token modal', async () => {
    render(<AddToken />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('add-token-modal')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('add-token-cancel-button'));
    });
    await waitFor(() => {
      expect(screen.queryByTestId('add-token-modal')).not.toBeInTheDocument();
    });
  });

  it('renders addToken and display toast error', async () => {
    const errorMsg = {
      description: 'api error message',
      title: 'formTokenToastErrorTitle',
      variant: 'destructive',
    };
    vi.mocked(tokensApi.addToken).mockImplementationOnce(() => {
      throw apiErrorMock;
    });
    render(<AddToken />, { wrapper: RouterWithQueryClientWrapper });
    act(() => {
      fireEvent.change(screen.getByTestId('token-name-input'), {
        target: {
          value: 'token-error',
        },
      });
    });

    // Select region
    await handleSelectOption('select-region-trigger', 'GRA');

    act(() => {
      fireEvent.click(screen.getByTestId('add-token-submit-button'));
    });
    await waitFor(() => {
      expect(tokensApi.addToken).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith(errorMsg);
    });
  });

  it('renders addToken and display token, copy it and close the modal', async () => {
    Object.assign(window.navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    });
    const successMsg = {
      description: 'formTokenToastSuccessDescription',
      title: 'formTokenToastSuccessTitle',
    };
    render(<AddToken />, { wrapper: RouterWithQueryClientWrapper });
    act(() => {
      fireEvent.change(screen.getByTestId('token-name-input'), {
        target: {
          value: 'newToken',
        },
      });
    });
    // Select region
    await handleSelectOption('select-region-trigger', 'GRA');

    act(() => {
      fireEvent.click(screen.getByTestId('add-token-submit-button'));
    });
    await waitFor(() => {
      expect(tokensApi.addToken).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith(successMsg);
    });

    await waitFor(() => {
      expect(screen.getByTestId('token-copy-button')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('token-copy-button'));
    });
    await waitFor(() => {
      expect(window.navigator.clipboard.writeText).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalled();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('token-close-button'));
    });
    await waitFor(() => {
      expect(screen.queryByTestId('add-token-modal')).not.toBeInTheDocument();
    });
  });
});
