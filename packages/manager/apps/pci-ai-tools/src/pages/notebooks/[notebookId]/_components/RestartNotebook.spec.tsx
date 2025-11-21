import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useToast } from '@datatr-ux/uxlib';
import * as notebookApi from '@/data/api/ai/notebook/notebook.api';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedNotebook } from '@/__tests__/helpers/mocks/notebook/notebook';
import { apiErrorMock } from '@/__tests__/helpers/mocks/shared/aiError';
import RestartNotebook from '@/pages/notebooks/[notebookId]/_components/RestartNotebook.component';

describe('Start notebook modal', () => {
  beforeEach(() => {
    vi.mock('@/data/api/ai/notebook/notebook.api', () => ({
      getNotebooks: vi.fn(() => [mockedNotebook]),
      restartNotebook: vi.fn((notebook) => notebook),
    }));
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  const onSuccess = vi.fn();
  const onError = vi.fn();
  it('should open the modal', async () => {
    render(<RestartNotebook notebook={mockedNotebook} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.queryByTestId('restart-notebook-modal')).toBeTruthy();
    });
  });

  it('should restart the notebook on submit', async () => {
    render(
      <RestartNotebook notebook={mockedNotebook} onSuccess={onSuccess} />,
      {
        wrapper: RouterWithQueryClientWrapper,
      },
    );
    await act(async () => {
      await userEvent.click(screen.getByTestId('restart-notebook-submit-button'));
    });
    await waitFor(() => {
      expect(notebookApi.restartNotebook).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'notebookToastSuccessTitle',
        description: 'restartNotebookToastSuccessDescription',
      });
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('should call onError when API fails', async () => {
    vi.mocked(notebookApi.restartNotebook).mockImplementation(() => {
      throw apiErrorMock;
    });
    render(<RestartNotebook notebook={mockedNotebook} onError={onError} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await act(async () => {
      await userEvent.click(screen.getByTestId('restart-notebook-submit-button'));
    });
    await waitFor(() => {
      expect(notebookApi.restartNotebook).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'notebookToastErrorTitle',
        description: apiErrorMock.response.data.message,
        variant: 'destructive',
      });
      expect(onError).toHaveBeenCalled();
    });
  });
});