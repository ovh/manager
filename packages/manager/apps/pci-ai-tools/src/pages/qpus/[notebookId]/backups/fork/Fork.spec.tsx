import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { UseQueryResult } from '@tanstack/react-query';
import { useToast } from '@datatr-ux/uxlib';
import ai from '@/types/AI';
import { mockedNotebook } from '@/__tests__/helpers/mocks/notebook/notebook';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedBackup } from '@/__tests__/helpers/mocks/notebook/backup';
import Fork from './Fork.modal';
import * as backupApi from '@/data/api/ai/notebook/backups/backups.api';
import { apiErrorMock } from '@/__tests__/helpers/mocks/shared/aiError';

describe('Fork backup modal', () => {
  beforeEach(() => {
    vi.restoreAllMocks();

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

    vi.mock('react-router-dom', async () => {
      const mod = await vi.importActual('react-router-dom');
      return {
        ...mod,
        useParams: () => ({
          backupId: 'backupId',
        }),
      };
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders modal skeleton while loading', async () => {
    render(<Fork />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('dialog-container')).toBeTruthy();
  });

  it('renders Fork modal', async () => {
    render(<Fork />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('fork-modal')).toBeTruthy();
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
    expect(screen.getByTestId('fork-modal')).toBeTruthy();
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
