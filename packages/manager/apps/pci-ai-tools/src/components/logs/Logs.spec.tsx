import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UseQueryResult } from '@tanstack/react-query';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedNotebook } from '@/__tests__/helpers/mocks/notebook/notebook';
import Logs from './Logs.component';
import { mockedLogs } from '@/__tests__/helpers/mocks/shared/logs';
import ai from '@/types/AI';

describe('Logs page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    vi.mock('@/pages/notebooks/[notebookId]/Notebook.context', () => ({
      useNotebookData: vi.fn(() => ({
        projectId: 'projectId',
        notebook: mockedNotebook,
        serviceQuery: {} as UseQueryResult<ai.notebook.Notebook, Error>,
      })),
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders skeleton while loading', async () => {
    render(<Logs.Skeleton itemCount={24} maxWidth={17} minWidth={9} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    expect(screen.getByTestId('skeleton-container')).toBeTruthy();
  });

  it('renders Logs', async () => {
    render(<Logs logs={mockedLogs} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    expect(screen.getByTestId('logs-area')).toBeTruthy();
  });
});
