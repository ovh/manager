import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { UseQueryResult } from '@tanstack/react-query';
import { useToast } from '@datatr-ux/uxlib';
import {
  mockedNotebook,
  mockedNotebookSpec,
  mockedNotebookStatus,
} from '@/__tests__/helpers/mocks/notebook/notebook';
import { mockedCommand } from '@/__tests__/helpers/mocks/shared/command';
import Dashboard from './Dashboard.page';
import * as notebookApi from '@/data/api/ai/notebook/notebook.api';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { apiErrorMock } from '@/__tests__/helpers/mocks/shared/aiError';
import ai from '@/types/AI';

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
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders Dashboard', async () => {
    render(<Dashboard />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('dashboard-container')).toBeTruthy();
  });

  it('renders Dashboard with toast error on API Error', async () => {
    vi.mocked(notebookApi.getCommand).mockImplementation(() => {
      throw apiErrorMock;
    });
    render(<Dashboard />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('dashboard-container')).toBeTruthy();
    await waitFor(() => {
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'errorGetCommandCli',
        description: apiErrorMock.response.data.message,
        variant: 'destructive',
      });
    });
  });
});
