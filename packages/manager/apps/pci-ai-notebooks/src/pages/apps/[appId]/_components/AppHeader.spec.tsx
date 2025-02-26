import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import * as ai from '@/types/cloud/project/ai';
import { Locale } from '@/hooks/useLocale';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedApp, mockedAppStatus } from '@/__tests__/helpers/mocks/app';
import { AppHeader } from './AppHeader.component';

const runningApp: ai.app.App = {
  ...mockedApp,
  status: {
    ...mockedAppStatus,
    state: ai.app.AppStateEnum.RUNNING,
  },
};

const stroppedApp: ai.app.App = {
  ...mockedApp,
  status: {
    ...mockedAppStatus,
    state: ai.app.AppStateEnum.STOPPED,
  },
};
describe('App Header component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    // Mock necessary hooks and dependencies
    vi.mock('react-i18next', () => ({
      useTranslation: () => ({
        t: (key: string) => key,
      }),
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
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders AppHeader and trigger stop modal', async () => {
    render(<AppHeader.Skeleton />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    expect(screen.getByTestId('app-header-skeleton')).toBeInTheDocument();
  });

  it('renders AppHeader and trigger stop modal', async () => {
    render(<AppHeader app={runningApp} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    expect(screen.getByTestId('app-header-container')).toBeInTheDocument();
    expect(screen.getByTestId('open-stop-modal-button')).toBeInTheDocument();
    expect(
      screen.queryByTestId('open-start-modal-button'),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId('open-stop-modal-button'));
    await waitFor(() => {
      expect(screen.getByTestId('stop-app-modal')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('stop-app-cancel-button'));
    await waitFor(() => {
      expect(screen.queryByTestId('stop-app-modal')).not.toBeInTheDocument();
    });
  });

  it('renders AppHeader and trigger start modal', async () => {
    render(<AppHeader app={stroppedApp} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    expect(screen.getByTestId('app-header-container')).toBeInTheDocument();
    expect(screen.getByTestId('open-start-modal-button')).toBeInTheDocument();
    expect(
      screen.queryByTestId('open-stop-modal-button'),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId('open-start-modal-button'));
    await waitFor(() => {
      expect(screen.getByTestId('start-app-modal')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('start-app-cancel-button'));
    await waitFor(() => {
      expect(screen.queryByTestId('start-app-modal')).not.toBeInTheDocument();
    });
  });
});
