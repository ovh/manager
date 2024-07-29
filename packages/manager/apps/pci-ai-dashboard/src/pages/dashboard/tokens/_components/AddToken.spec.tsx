import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { Locale } from '@/hooks/useLocale.hook';

import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import * as tokensApi from '@/data/api/ai/token.api';
import { apiErrorMock } from '@/__tests__/helpers/mocks/aiError';
import { useToast } from '@/components/ui/use-toast';
import { mockedToken } from '@/__tests__/helpers/mocks/token';
import Tokens from '../Tokens.page';
import { mockedCapabilitiesRegion } from '@/__tests__/helpers/mocks/region';

describe('AddToken modal', () => {
  beforeEach(() => {
    // Mock necessary hooks and dependencies
    vi.mock('react-i18next', () => ({
      useTranslation: () => ({
        t: (key: string) => key,
      }),
    }));
    vi.mock('@/components/ui/use-toast', () => {
      const toastMock = vi.fn();
      return {
        useToast: vi.fn(() => ({
          toast: toastMock,
        })),
      };
    });
    vi.mock('@/data/api/ai/token.api', () => ({
      getTokens: vi.fn(() => [mockedToken]),
      addToken: vi.fn(() => mockedToken),
    }));

    vi.mock('@/data/api/ai/capabilities.api', () => ({
      getRegions: vi.fn(() => [mockedCapabilitiesRegion]),
    }));

    vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
      const mod = await importOriginal<
        typeof import('@ovh-ux/manager-react-shell-client')
      >();
      return {
        ...mod,
        useShell: vi.fn(() => ({
          i18n: {
            getLocale: vi.fn(() => Locale.fr_FR),
            onLocaleChange: vi.fn(),
            setLocale: vi.fn(),
          },
        })),
      };
    });
    render(<Tokens />, { wrapper: RouterWithQueryClientWrapper });
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('open and close add token modal', async () => {
    act(() => {
      fireEvent.click(screen.getByTestId('create-token-button'));
    });
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
    act(() => {
      fireEvent.click(screen.getByTestId('create-token-button'));
    });
    await waitFor(() => {
      expect(screen.getByTestId('add-token-modal')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.change(screen.getByTestId('token-name-input'), {
        target: {
          value: 'token-error',
        },
      });
    });
    act(() => {
      fireEvent.click(screen.getByTestId('add-token-submit-button'));
    });
    await waitFor(() => {
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
    act(() => {
      fireEvent.click(screen.getByTestId('create-token-button'));
    });
    await waitFor(() => {
      expect(screen.getByTestId('add-token-modal')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.change(screen.getByTestId('token-name-input'), {
        target: {
          value: 'newToken',
        },
      });
    });
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
