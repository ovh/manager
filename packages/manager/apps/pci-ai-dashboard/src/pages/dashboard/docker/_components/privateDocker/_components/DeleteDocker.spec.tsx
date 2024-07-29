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
import { mockedCapabilitiesRegion } from '@/__tests__/helpers/mocks/region';
import { apiErrorMock } from '@/__tests__/helpers/mocks/aiError';
import { useToast } from '@/components/ui/use-toast';
import { mockedRegistry } from '@/__tests__/helpers/mocks/registry';
import Docker from '../../../Docker.page';

describe('DeleteDocker modal', () => {
  const openButtonInMenu = async (buttonId: string) => {
    act(() => {
      const trigger = screen.getByTestId('docker-action-trigger');
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
    vi.mock('@/data/api/ai/registry.api', () => ({
      getRegistries: vi.fn(() => [mockedRegistry]),
      deleteRegistry: vi.fn(),
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
    await waitFor(() => {
      expect(screen.getByText(mockedRegistry.id)).toBeInTheDocument();
    });
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('open and close delete docker modal', async () => {
    await openButtonInMenu('docker-action-delete-button');
    await waitFor(() => {
      expect(screen.getByTestId('delete-docker-modal')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('delete-docker-cancel-button'));
    });
    await waitFor(() => {
      expect(
        screen.queryByTestId('delete-docker-modal'),
      ).not.toBeInTheDocument();
    });
  });

  it('display error on delete docker error', async () => {
    const errorMsg = {
      description: 'api error message',
      title: 'deleteDockerToastErrorTitle',
      variant: 'destructive',
    };
    vi.mocked(registryApi.deleteRegistry).mockImplementationOnce(() => {
      throw apiErrorMock;
    });
    await openButtonInMenu('docker-action-delete-button');
    await waitFor(() => {
      expect(screen.getByTestId('delete-docker-modal')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('delete-docker-submit-button'));
    });
    await waitFor(() => {
      expect(useToast().toast).toHaveBeenCalledWith(errorMsg);
    });
  });

  it('refetch data on delete docker success', async () => {
    await openButtonInMenu('docker-action-delete-button');
    await waitFor(() => {
      expect(screen.getByTestId('delete-docker-modal')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('delete-docker-submit-button'));
    });
    await waitFor(() => {
      expect(
        screen.queryByTestId('delete-docker-modal'),
      ).not.toBeInTheDocument();
      expect(registryApi.deleteRegistry).toHaveBeenCalled();
      expect(registryApi.getRegistries).toHaveBeenCalled();
    });
  });
});
