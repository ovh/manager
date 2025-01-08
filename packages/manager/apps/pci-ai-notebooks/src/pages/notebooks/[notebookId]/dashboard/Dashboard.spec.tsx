import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { UseQueryResult } from '@tanstack/react-query';
import * as ai from '@/types/cloud/project/ai';
import {
  mockedNotebook,
  mockedNotebookSpec,
  mockedNotebookStatus,
} from '@/__tests__/helpers/mocks/notebook';
import { Locale } from '@/hooks/useLocale';
import { mockedCommand } from '@/__tests__/helpers/mocks/command';
import Dashboard from './Dashboard.page';
import * as notebookApi from '@/data/api/ai/notebook/notebook.api';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { apiErrorMock } from '@/__tests__/helpers/mocks/aiError';
import { useToast } from '@/components/ui/use-toast';

const mockedNotebookBis: ai.notebook.Notebook = {
  ...mockedNotebook,
  spec: {
    ...mockedNotebookSpec,
    labels: { key: 'label' },
  },
  status: {
    ...mockedNotebookStatus,
    workspace: {
      storageFree: 10,
      storageUsed: 1,
    },
  },
};

describe('Dashboard page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    // Mock necessary hooks and dependencies
    vi.mock('react-i18next', () => ({
      useTranslation: () => ({
        t: (key: string) => key,
      }),
    }));

    vi.mock('@/data/api/ai/notebook/notebook.api', () => ({
      getCommand: vi.fn(() => mockedCommand),
    }));

    vi.mock('@/pages/notebooks/[notebookId]/Notebook.context', () => ({
      useNotebookData: vi.fn(() => ({
        projectId: 'projectId',
        notebook: mockedNotebookBis,
        serviceQuery: {} as UseQueryResult<ai.notebook.Notebook, Error>,
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
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders Dashboard', async () => {
    render(<Dashboard />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('dashboard-container')).toBeInTheDocument();
  });

  it('renders Dashboard with toast error on API Error', async () => {
    vi.mocked(notebookApi.getCommand).mockImplementation(() => {
      throw apiErrorMock;
    });
    render(<Dashboard />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('dashboard-container')).toBeInTheDocument();
    await waitFor(() => {
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'errorGetCommandCli',
        description: apiErrorMock.response.data.message,
        variant: 'destructive',
      });
    });
  });
});
