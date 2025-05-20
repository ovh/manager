import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ai from '@/types/AI';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { NotebookHeader } from './NotebookHeader.component';
import {
  mockedNotebook,
  mockedNotebookStatus,
} from '@/__tests__/helpers/mocks/notebook/notebook';

const runningNotebook: ai.notebook.Notebook = {
  ...mockedNotebook,
  status: {
    ...mockedNotebookStatus,
    state: ai.notebook.NotebookStateEnum.RUNNING,
  },
};

const stroppedNotebook: ai.notebook.Notebook = {
  ...mockedNotebook,
  status: {
    ...mockedNotebookStatus,
    state: ai.notebook.NotebookStateEnum.STOPPED,
  },
};
describe('Notebook Header component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders NotebookHeader and trigger stop modal', async () => {
    render(<NotebookHeader.Skeleton />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    expect(screen.getByTestId('notebook-header-skeleton')).toBeTruthy();
  });

  it('renders NotebookHeader and trigger stop modal', async () => {
    render(<NotebookHeader notebook={runningNotebook} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    expect(screen.getByTestId('notebook-header-container')).toBeTruthy();
    expect(screen.getByTestId('open-stop-modal-button')).toBeTruthy();
    expect(screen.queryByTestId('open-start-modal-button')).toBeNull();

    fireEvent.click(screen.getByTestId('open-stop-modal-button'));
    await waitFor(() => {
      expect(screen.getByTestId('stop-notebook-modal')).toBeTruthy();
    });
    fireEvent.click(screen.getByTestId('stop-notebook-cancel-button'));
    await waitFor(() => {
      expect(screen.queryByTestId('stop-notebook-modal')).toBeNull();
    });
  });

  it('renders NotebookHeader and trigger start modal', async () => {
    render(<NotebookHeader notebook={stroppedNotebook} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    expect(screen.getByTestId('notebook-header-container')).toBeTruthy();
    expect(screen.getByTestId('open-start-modal-button')).toBeTruthy();
    expect(screen.queryByTestId('open-stop-modal-button')).toBeNull();

    fireEvent.click(screen.getByTestId('open-start-modal-button'));
    await waitFor(() => {
      expect(screen.getByTestId('start-notebook-modal')).toBeTruthy();
    });
    fireEvent.click(screen.getByTestId('start-notebook-cancel-button'));
    await waitFor(() => {
      expect(screen.queryByTestId('start-notebook-modal')).toBeNull();
    });
  });
});
