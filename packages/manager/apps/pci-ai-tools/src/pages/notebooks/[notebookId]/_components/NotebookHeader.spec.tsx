import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ai from '@/types/AI';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { NotebookHeader } from './NotebookHeader.component';
import {
  mockedNotebook,
  mockedNotebookStatus,
} from '@/__tests__/helpers/mocks/notebook/notebook';

const hiddenNotebookApiMessage =
  "Pulling notebook's data";

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

const pendingNotebook: ai.notebook.Notebook = {
  ...mockedNotebook,
  status: {
    ...mockedNotebookStatus,
    info: undefined,
    state: ai.notebook.NotebookStateEnum.STARTING,
    lastJobStatus: {
      ...mockedNotebookStatus.lastJobStatus,
      timeoutAt: '2026-01-28T13:55:10Z',
      info: {
        ...mockedNotebookStatus.lastJobStatus.info,
        code: 'JOB_PENDING' as ai.InfoCodeEnum,
        message: hiddenNotebookApiMessage,
      },
    },
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

  it('renders pending expiry information when notebook is waiting for resources', async () => {
    render(<NotebookHeader notebook={pendingNotebook} />, {
      wrapper: RouterWithQueryClientWrapper,
    });

    expect(screen.getByText('waitingResourceLabel')).toBeTruthy();

    fireEvent.click(screen.getByTestId('notebook-pending-timeout-info-trigger'));

    await waitFor(() => {
      expect(
        screen.getByText(
          'pendingTimeoutHint',
        ),
      ).toBeTruthy();
    });

    expect(
      screen.queryByText(hiddenNotebookApiMessage),
    ).toBeNull();
  });
});
