import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { Locale } from '@/hooks/useLocale';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import * as datastoreApi from '@/data/api/ai/datastore.api';
import { apiErrorMock } from '@/__tests__/helpers/mocks/aiError';
import { useToast } from '@/components/ui/use-toast';
import { mockedCapabilitiesRegionGRA } from '@/__tests__/helpers/mocks/region';
import { mockedGitWithRegion } from '@/__tests__/helpers/mocks/datastore';
import AddGit from './AddGit.modal';
import { handleSelectOption } from '@/__tests__/helpers/unitTestHelper';

describe('AddGit modal', () => {
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
    vi.mock('@/data/api/ai/datastore.api', () => ({
      getDatastores: vi.fn(() => [mockedGitWithRegion]),
      addDatastore: vi.fn(() => mockedGitWithRegion),
    }));

    vi.mock('@/data/api/ai/capabilities.api', () => ({
      getRegions: vi.fn(() => [mockedCapabilitiesRegionGRA]),
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
    const ResizeObserverMock = vi.fn(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));
    vi.stubGlobal('ResizeObserver', ResizeObserverMock);
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders modal skeleton while loading', async () => {
    render(<AddGit />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('dialog-container')).toBeInTheDocument();
  });

  it('open and close add git modal', async () => {
    render(<AddGit />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('add-git-modal')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('add-git-cancel-button'));
    });
    await waitFor(() => {
      expect(screen.queryByTestId('add-git-modal')).not.toBeInTheDocument();
    });
  });

  it('renders addGit and display toast error', async () => {
    render(<AddGit />, { wrapper: RouterWithQueryClientWrapper });
    const errorMsg = {
      description: 'api error message',
      title: 'formGitToastErrorTitle',
      variant: 'destructive',
    };
    vi.mocked(datastoreApi.addDatastore).mockImplementationOnce(() => {
      throw apiErrorMock;
    });
    act(() => {
      fireEvent.change(screen.getByTestId('git-alias-input'), {
        target: {
          value: 'alias',
        },
      });
    });
    act(() => {
      fireEvent.change(screen.getByTestId('git-endpoint-input'), {
        target: {
          value: 'endpoint',
        },
      });
    });
    act(() => {
      fireEvent.change(screen.getByTestId('git-username-input'), {
        target: {
          value: 'git-username-input',
        },
      });
    });
    act(() => {
      fireEvent.change(screen.getByTestId('git-password-input'), {
        target: {
          value: 'password',
        },
      });
    });

    // Select region
    await handleSelectOption('select-region-trigger', 'GRA');

    act(() => {
      fireEvent.click(screen.getByTestId('add-git-submit-button'));
    });
    await waitFor(() => {
      expect(datastoreApi.addDatastore).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith(errorMsg);
    });
  });

  it('renders addToken with basic auth and refresh getRegistries after added', async () => {
    render(<AddGit />, { wrapper: RouterWithQueryClientWrapper });
    act(() => {
      fireEvent.change(screen.getByTestId('git-alias-input'), {
        target: {
          value: 'alias',
        },
      });
    });
    act(() => {
      fireEvent.change(screen.getByTestId('git-endpoint-input'), {
        target: {
          value: 'endpoint',
        },
      });
    });
    act(() => {
      fireEvent.change(screen.getByTestId('git-username-input'), {
        target: {
          value: 'git-username-input',
        },
      });
    });
    act(() => {
      fireEvent.change(screen.getByTestId('git-password-input'), {
        target: {
          value: 'password',
        },
      });
    });

    // Select region
    await handleSelectOption('select-region-trigger', 'GRA');

    act(() => {
      fireEvent.click(screen.getByTestId('add-git-submit-button'));
    });
    await waitFor(() => {
      expect(datastoreApi.addDatastore).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'formGitToastSuccessTitle',
        description: 'formGitToastSuccessDescription',
      });
    });
  });

  it('renders addToken with sshkey and refresh getRegistries after added', async () => {
    render(<AddGit />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('add-git-modal')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.change(screen.getByTestId('git-alias-input'), {
        target: {
          value: 'alias',
        },
      });
    });
    act(() => {
      fireEvent.change(screen.getByTestId('git-endpoint-input'), {
        target: {
          value: 'endpoint',
        },
      });
    });
    act(() => {
      fireEvent.click(screen.getByTestId('radio-button-ssh-key'));
    });
    act(() => {
      fireEvent.change(screen.getByTestId('git-public-key-input'), {
        target: {
          value: 'git-username-input',
        },
      });
    });
    act(() => {
      fireEvent.change(screen.getByTestId('git-private-key-input'), {
        target: {
          value: 'password',
        },
      });
    });

    // Select region
    await handleSelectOption('select-region-trigger', 'GRA');

    act(() => {
      fireEvent.click(screen.getByTestId('add-git-submit-button'));
    });
    await waitFor(() => {
      expect(datastoreApi.addDatastore).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'formGitToastSuccessTitle',
        description: 'formGitToastSuccessDescription',
      });
    });
  });
});
