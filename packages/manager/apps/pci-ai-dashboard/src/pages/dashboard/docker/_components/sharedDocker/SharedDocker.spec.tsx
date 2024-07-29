import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import SharedDocker from '@/pages/dashboard/docker/_components/sharedDocker/SharedDocker.component';
import { Locale } from '@/hooks/useLocale.hook';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedCapabilitiesRegion } from '@/__tests__/helpers/mocks/region';
import { useToast } from '@/components/ui/use-toast';

describe('SharedDocker page', () => {
  beforeEach(() => {
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
        useParams: () => ({
          projectId: '123456',
        }),
      };
    });
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders and shows buttons in the shareddockers page', async () => {
    render(<SharedDocker regions={[mockedCapabilitiesRegion]} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    expect(screen.getByTestId('shared-docker-title')).toBeInTheDocument();
    expect(
      screen.getByTestId('shared-docker-login-copy-button'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('shared-docker-tag-copy-button'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('shared-docker-push-copy-button'),
    ).toBeInTheDocument();
  });

  it('copy login button call useToast in the shareddockers page', async () => {
    render(<SharedDocker regions={[mockedCapabilitiesRegion]} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    Object.assign(window.navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    });
    const successCopy = {
      title: 'sharedDockerCopy',
    };
    act(() => {
      fireEvent.click(screen.getByTestId('shared-docker-login-copy-button'));
    });
    await waitFor(() => {
      expect(useToast().toast).toHaveBeenCalledWith(successCopy);
    });
  });
  it('copy tag button call useToast in the shareddockers page', async () => {
    render(<SharedDocker regions={[mockedCapabilitiesRegion]} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    Object.assign(window.navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    });
    const successCopy = {
      title: 'sharedDockerCopy',
    };
    act(() => {
      fireEvent.click(screen.getByTestId('shared-docker-tag-copy-button'));
    });
    await waitFor(() => {
      expect(useToast().toast).toHaveBeenCalledWith(successCopy);
    });
  });
  it('copy tag button call useToast in the shareddockers page', async () => {
    render(<SharedDocker regions={[mockedCapabilitiesRegion]} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    Object.assign(window.navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    });
    const successCopy = {
      title: 'sharedDockerCopy',
    };
    act(() => {
      fireEvent.click(screen.getByTestId('shared-docker-push-copy-button'));
    });
    await waitFor(() => {
      expect(useToast().toast).toHaveBeenCalledWith(successCopy);
    });
  });
});
