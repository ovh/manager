import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { UseQueryResult } from '@tanstack/react-query';
import * as ai from '@/types/cloud/project/ai';
import { mockedNotebook } from '@/__tests__/helpers/mocks/notebook';
import { Locale } from '@/hooks/useLocale';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedBackup } from '@/__tests__/helpers/mocks/backup';
import Backups, { breadcrumb as Breadcrumb } from './Backups.page';
import { openButtonInMenu } from '@/__tests__/helpers/unitTestHelper';

const mockedUsedNavigate = vi.fn();
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
      getBackups: vi.fn(() => [mockedBackup]),
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

  it('renders the breadcrumb component', async () => {
    const translationKey = 'breadcrumb';
    render(<Breadcrumb />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(translationKey)).toBeInTheDocument();
    });
  });

  it('renders Skeleton while loading', async () => {
    render(<Backups />, { wrapper: RouterWithQueryClientWrapper });
    expect(
      screen.getByTestId('backup-list-table-skeleton'),
    ).toBeInTheDocument();
  });

  it('renders backups page', async () => {
    render(<Backups />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByText(mockedBackup.id)).toBeInTheDocument();
  });

  it('open fork backup modal using action table', async () => {
    render(<Backups />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(mockedBackup.id)).toBeInTheDocument();
    });
    await openButtonInMenu(
      'backup-action-trigger',
      'backup-action-fork-button',
    );
    expect(mockedUsedNavigate).toHaveBeenCalledWith(
      `./fork/${mockedBackup.id}`,
    );
  });
});
