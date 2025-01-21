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
import { mockedToken } from '@/__tests__/helpers/mocks/token';
import { apiErrorMock } from '@/__tests__/helpers/mocks/aiError';
import { useToast } from '@/components/ui/use-toast';
import DeleteToken from './DeleteToken.modal';

describe('DeleteToken modal', () => {
  beforeEach(async () => {
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
      deleteToken: vi.fn(),
      getToken: vi.fn(() => mockedToken),
    }));

    vi.mock('react-router-dom', async () => {
      const mod = await vi.importActual('react-router-dom');
      return {
        ...mod,
        useParams: () => ({
          projectId: 'projectId',
          tokenId: 'tokenId',
        }),
      };
    });

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
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders skeleton while loading', async () => {
    render(<DeleteToken />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('dialog-container')).toBeInTheDocument();
    });
  });

  it('open and close delete token modal', async () => {
    render(<DeleteToken />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('delete-token-modal')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('delete-token-cancel-button'));
    });
    await waitFor(() => {
      expect(
        screen.queryByTestId('delete-token-modal'),
      ).not.toBeInTheDocument();
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
      expect(screen.getByTestId('delete-token-modal')).toBeInTheDocument();
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
