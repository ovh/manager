import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { UseQueryResult } from '@tanstack/react-query';
import { mockedUsedNavigate } from '@/__tests__/helpers/mockRouterDomHelper';
import * as ai from '@/types/cloud/project/ai';
import { mockedNotebook } from '@/__tests__/helpers/mocks/notebook';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedBackup } from '@/__tests__/helpers/mocks/backup';
import Backups, { breadcrumb as Breadcrumb } from './Backups.page';
import { openButtonInMenu } from '@/__tests__/helpers/unitTestHelper';

describe('Backups page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockedUsedNavigate();

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
