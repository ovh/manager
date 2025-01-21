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
import * as datastoreApi from '@/data/api/ai/datastore.api';
import { apiErrorMock } from '@/__tests__/helpers/mocks/aiError';
import { useToast } from '@/components/ui/use-toast';
import DeleteGit from './DeleteGit.modal';

describe('DeleteGit modal', () => {
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
    vi.mock('@/data/api/ai/datastore.api', () => ({
      deleteDatastore: vi.fn(),
    }));

    vi.mock('react-router-dom', async () => {
      const mod = await vi.importActual('react-router-dom');
      return {
        ...mod,
        useParams: () => ({
          projectId: 'projectId',
          alias: 'gitId',
          region: 'regionId',
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

  it('open and close delete git modal', async () => {
    render(<DeleteGit />, { wrapper: RouterWithQueryClientWrapper });
    act(() => {
      fireEvent.click(screen.getByTestId('delete-git-cancel-button'));
    });
    await waitFor(() => {
      expect(screen.queryByTestId('delete-git-modal')).not.toBeInTheDocument();
    });
  });

  it('display error on delete git error', async () => {
    const errorMsg = {
      description: 'api error message',
      title: 'deleteGitToastErrorTitle',
      variant: 'destructive',
    };
    vi.mocked(datastoreApi.deleteDatastore).mockImplementationOnce(() => {
      throw apiErrorMock;
    });
    render(<DeleteGit />, { wrapper: RouterWithQueryClientWrapper });
    act(() => {
      fireEvent.click(screen.getByTestId('delete-git-submit-button'));
    });
    await waitFor(() => {
      expect(datastoreApi.deleteDatastore).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith(errorMsg);
    });
  });

  it('refetch data on delete git success', async () => {
    render(<DeleteGit />, { wrapper: RouterWithQueryClientWrapper });
    act(() => {
      fireEvent.click(screen.getByTestId('delete-git-submit-button'));
    });
    await waitFor(() => {
      expect(datastoreApi.deleteDatastore).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'deleteGitToastSuccessTitle',
        description: 'deleteGitToastSuccessDescription',
      });
    });
  });
});
