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
import Tokens from '../Tokens.page';
import { mockedCapabilitiesRegion } from '@/__tests__/helpers/mocks/region';
import { apiErrorMock } from '@/__tests__/helpers/mocks/aiError';
import { useToast } from '@/components/ui/use-toast';

describe('DeleteToken modal', () => {
  const openButtonInMenu = async (buttonId: string) => {
    act(() => {
      const trigger = screen.getByTestId('token-action-trigger');
      fireEvent.focus(trigger);
      fireEvent.keyDown(trigger, {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        charCode: 13,
      });
    });
    const actionButton = screen.getByTestId(buttonId);
    await waitFor(() => {
      expect(actionButton).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(actionButton);
    });
  };

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
      getTokens: vi.fn(() => [mockedToken]),
      deleteToken: vi.fn(),
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
    await waitFor(() => {
      expect(screen.getByText(mockedToken.spec.name)).toBeInTheDocument();
    });
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('open and close delete token modal', async () => {
    await openButtonInMenu('token-action-delete-button');
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
    await openButtonInMenu('token-action-delete-button');
    await waitFor(() => {
      expect(screen.getByTestId('delete-token-modal')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('delete-token-submit-button'));
    });
    await waitFor(() => {
      expect(useToast().toast).toHaveBeenCalledWith(errorMsg);
    });
  });

  it('refetch data on delete token success', async () => {
    await openButtonInMenu('token-action-delete-button');
    await waitFor(() => {
      expect(screen.getByTestId('delete-token-modal')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('delete-token-submit-button'));
    });
    await waitFor(() => {
      expect(
        screen.queryByTestId('delete-token-modal'),
      ).not.toBeInTheDocument();
      expect(tokensApi.deleteToken).toHaveBeenCalled();
      expect(tokensApi.getTokens).toHaveBeenCalled();
    });
  });
});
