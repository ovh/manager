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
import { mockedNotebook } from '@/__tests__/helpers/mocks/notebook';
import { Locale } from '@/hooks/useLocale';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedBackup } from '@/__tests__/helpers/mocks/backup';
import Fork from './Fork.modal';
import * as backupApi from '@/data/api/ai/notebook/backups/backups.api';
import { useToast } from '@/components/ui/use-toast';
import { apiErrorMock } from '@/__tests__/helpers/mocks/aiError';

describe('Backups page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    // Mock necessary hooks and dependencies
    vi.mock('react-i18next', () => ({
      useTranslation: () => ({
        t: (key: string) => key,
      }),
    }));

    vi.mock('@/pages/notebooks/[notebookId]/Notebook.context', () => ({
      useNotebookData: vi.fn(() => ({
        projectId: 'projectId',
        notebook: mockedNotebook,
        serviceQuery: {} as UseQueryResult<ai.notebook.Notebook, Error>,
      })),
    }));

    vi.mock('@/data/api/ai/notebook/backups/backups.api', () => ({
      getBackup: vi.fn(() => mockedBackup),
      forkBackup: vi.fn((backup) => backup),
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

    vi.mock('react-router-dom', async () => {
      const mod = await vi.importActual('react-router-dom');
      return {
        ...mod,
        useParams: () => ({
          backupId: 'backupId',
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
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders modal skeleton while loading', async () => {
    render(<Fork />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('dialog-container')).toBeInTheDocument();
  });

  it('renders Fork modal', async () => {
    render(<Fork />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('fork-modal')).toBeInTheDocument();
  });

  it('trigger onError on API Error', async () => {
    vi.mocked(backupApi.forkBackup).mockImplementation(() => {
      throw apiErrorMock;
    });
    render(<Fork />, { wrapper: RouterWithQueryClientWrapper });
    act(() => {
      fireEvent.click(screen.getByTestId('fork-backup-submit-button'));
    });
    await waitFor(() => {
      expect(backupApi.forkBackup).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'forkToastErrorTitle',
        description: apiErrorMock.response.data.message,
        variant: 'destructive',
      });
    });
  });

  it('trigger onSuccess on summit click', async () => {
    render(<Fork />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('fork-modal')).toBeInTheDocument();
    act(() => {
      fireEvent.click(screen.getByTestId('fork-backup-submit-button'));
    });
    await waitFor(() => {
      expect(backupApi.forkBackup).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'forkToastSuccessTitle',
        description: 'forkToastSuccessDescription',
      });
    });
  });
});
