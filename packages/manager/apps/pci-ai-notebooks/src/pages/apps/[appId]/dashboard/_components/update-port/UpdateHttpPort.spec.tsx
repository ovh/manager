import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { UseQueryResult } from '@tanstack/react-query';
import * as ai from '@/types/cloud/project/ai';
import { Locale } from '@/hooks/useLocale';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import * as appApi from '@/data/api/ai/app/app.api';
import { useToast } from '@/components/ui/use-toast';
import { apiErrorMock } from '@/__tests__/helpers/mocks/aiError';
import { mockedApp } from '@/__tests__/helpers/mocks/app';
import UpdateHttpPort from './UpdateHttpPort.modal';

describe('Update Port', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    // Mock necessary hooks and dependencies
    vi.mock('react-i18next', () => ({
      useTranslation: () => ({
        t: (key: string) => key,
      }),
    }));

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
        useNavigation: () => ({
          getURL: vi.fn(
            (app: string, path: string) => `#mockedurl-${app}${path}`,
          ),
        }),
      };
    });

    vi.mock('@/components/ui/use-toast', () => {
      const toastMock = vi.fn();
      return {
        useToast: vi.fn(() => ({
          toast: toastMock,
        })),
      };
    });

    const mockScrollIntoView = vi.fn();
    window.HTMLElement.prototype.scrollIntoView = mockScrollIntoView;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders Update port modal and close it', async () => {
    render(<UpdateHttpPort />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('update-port-modal')).toBeInTheDocument();
    expect(screen.getByTestId('update-port-input')).toBeInTheDocument();
    act(() => {
      fireEvent.click(screen.getByTestId('update-port-cancel-button'));
    });
    await waitFor(() => {
      expect(screen.queryByTestId('update-port-modal')).not.toBeInTheDocument();
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
