import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UseQueryResult } from '@tanstack/react-query';
import {
  mockedNotebook,
  mockedNotebookSpec,
  mockedNotebookStatus,
} from '@/__tests__/helpers/mocks/notebook/notebook';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import Resources from './Resources.component';
import ai from '@/types/AI';

const mockedNotebookBis: ai.notebook.Notebook = {
  ...mockedNotebook,
  spec: {
    ...mockedNotebookSpec,
    resources: {
      cpu: 1,
      gpu: 0,
      ephemeralStorage: 1,
      flavor: 'flavor',
      memory: 1,
      privateNetwork: 1,
      publicNetwork: 1,
    },
  },
  status: {
    ...mockedNotebookStatus,
    workspace: {
      storageFree: 10,
      storageUsed: 1,
    },
  },
};

describe('Resources component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
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

  it('renders Resources', async () => {
    render(<Resources />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('resources-container')).toBeInTheDocument();
  });
});
