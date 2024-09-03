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
import * as registryApi from '@/data/api/ai/registry.api';
import { apiErrorMock } from '@/__tests__/helpers/mocks/aiError';
import { useToast } from '@/components/ui/use-toast';

import { mockedCapabilitiesRegion } from '@/__tests__/helpers/mocks/region';
import { mockedRegistry } from '@/__tests__/helpers/mocks/registry';
import Docker from '../../../Docker.page';

describe('AddDocker modal', () => {
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
    vi.mock('@/data/api/ai/registry.api', () => ({
      getRegistries: vi.fn(() => [mockedRegistry]),
      addRegistry: vi.fn(() => mockedRegistry),
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
    render(<Docker />, { wrapper: RouterWithQueryClientWrapper });
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('open and close add docker modal', async () => {
    act(() => {
      fireEvent.click(screen.getByTestId('create-docker-button'));
    });
    await waitFor(() => {
      expect(screen.getByTestId('add-docker-modal')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('add-docker-cancel-button'));
    });
    await waitFor(() => {
      expect(screen.queryByTestId('add-docker-modal')).not.toBeInTheDocument();
    });
  });

  it('renders addDocker and display toast error', async () => {
    const errorMsg = {
      description: 'api error message',
      title: 'formDockerToastErrorTitle',
      variant: 'destructive',
    };
    vi.mocked(registryApi.addRegistry).mockImplementationOnce(() => {
      throw apiErrorMock;
    });
    act(() => {
      fireEvent.click(screen.getByTestId('create-docker-button'));
    });
    await waitFor(() => {
      expect(screen.getByTestId('add-docker-modal')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.change(screen.getByTestId('docker-username-input'), {
        target: {
          value: 'userName',
        },
      });
    });
    act(() => {
      fireEvent.change(screen.getByTestId('docker-password-input'), {
        target: {
          value: 'password',
        },
      });
    });
    act(() => {
      fireEvent.change(screen.getByTestId('docker-url-input'), {
        target: {
          value: 'https://docker.io',
        },
      });
    });
    act(() => {
      fireEvent.click(screen.getByTestId('add-docker-submit-button'));
    });
    await waitFor(() => {
      expect(useToast().toast).toHaveBeenCalledWith(errorMsg);
    });
  });

  it('renders addToken and refresh getRegistries after added', async () => {
    act(() => {
      fireEvent.click(screen.getByTestId('create-docker-button'));
    });
    await waitFor(() => {
      expect(screen.getByTestId('add-docker-modal')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.change(screen.getByTestId('docker-username-input'), {
        target: {
          value: 'userName',
        },
      });
    });
    act(() => {
      fireEvent.change(screen.getByTestId('docker-password-input'), {
        target: {
          value: 'password',
        },
      });
    });
    act(() => {
      fireEvent.change(screen.getByTestId('docker-url-input'), {
        target: {
          value: 'https://docker.io',
        },
      });
    });
    act(() => {
      fireEvent.click(screen.getByTestId('add-docker-submit-button'));
    });
    await waitFor(() => {
      expect(screen.queryByTestId('add-docker-modal')).not.toBeInTheDocument();
      expect(registryApi.addRegistry).toHaveBeenCalled();
      expect(registryApi.getRegistries).toHaveBeenCalled();
    });
  });
});
