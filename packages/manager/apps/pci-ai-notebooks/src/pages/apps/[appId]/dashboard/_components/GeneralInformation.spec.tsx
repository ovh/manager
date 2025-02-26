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
import { useToast } from '@/components/ui/use-toast';
import { mockedApp, mockedAppStatus } from '@/__tests__/helpers/mocks/app';
import AppGeneralInfo from './GeneralInformation.component';

const mockedUsedNavigate = vi.fn();
describe('General information component', () => {
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
        app: {
          ...mockedApp,
          status: {
            ...mockedAppStatus,
            state: ai.app.AppStateEnum.STOPPED,
          },
        },
        appQuery: {} as UseQueryResult<ai.app.App, Error>,
      })),
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
    vi.mock('@/components/ui/use-toast', () => {
      const toastMock = vi.fn();
      return {
        useToast: vi.fn(() => ({
          toast: toastMock,
        })),
      };
    });

    vi.mock('react-router-dom', async () => {
      const mod = await vi.importActual('react-router-dom');
      return {
        ...mod,
        useNavigate: () => mockedUsedNavigate,
      };
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders GeneralInformation', async () => {
    render(<AppGeneralInfo />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('image-container')).toBeInTheDocument();
    expect(screen.getByTestId('port-container')).toBeInTheDocument();
    expect(screen.getByTestId('url-container')).toBeInTheDocument();
  });

  it('open update image modal', async () => {
    render(<AppGeneralInfo />, { wrapper: RouterWithQueryClientWrapper });
    act(() => {
      fireEvent.click(screen.getByTestId('update-image-button'));
    });
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('./update-image');
    });
  });

  it('open update port modal', async () => {
    render(<AppGeneralInfo />, { wrapper: RouterWithQueryClientWrapper });
    act(() => {
      fireEvent.click(screen.getByTestId('update-port-button'));
    });
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('./update-port');
    });
  });

  it('renders and trigger copy url in clipboard', async () => {
    Object.assign(window.navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    });
    render(<AppGeneralInfo />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(mockedApp.status.url)).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('url-copy-button'));
    });
    await waitFor(() => {
      expect(window.navigator.clipboard.writeText).toHaveBeenCalledWith(
        mockedApp.status.url,
      );
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'urlCopyToast',
      });
    });
  });
});
