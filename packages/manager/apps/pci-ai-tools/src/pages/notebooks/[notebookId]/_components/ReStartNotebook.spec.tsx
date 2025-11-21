import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from '@testing-library/react';
import { useToast } from '@datatr-ux/uxlib';
import * as notebookApi from '@/data/api/ai/notebook/notebook.api';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedNotebook } from '@/__tests__/helpers/mocks/notebook/notebook';
import { apiErrorMock } from '@/__tests__/helpers/mocks/shared/aiError';
import ReStartNotebook from './ReStartNotebook.component';

describe('Start notebook modal', () => {
  beforeEach(() => {
    vi.mock('@/data/api/ai/notebook/notebook.api', () => ({
      getNotebooks: vi.fn(() => [mockedNotebook]),
      reStartNotebook: vi.fn((notebook) => notebook),
    }));
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  const onSuccess = vi.fn();
  const onError = vi.fn();
  it('should open the modal', async () => {
    render(<ReStartNotebook notebook={mockedNotebook} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.queryByTestId('restart-notebook-modal')).toBeTruthy();
    });
  });

  it('should restart the notebook on submit', async () => {
    render(
      <ReStartNotebook notebook={mockedNotebook} onSuccess={onSuccess} />,
      {
        wrapper: RouterWithQueryClientWrapper,
      },
    );
    act(() => {
      fireEvent.click(screen.getByTestId('restart-notebook-submit-button'));
    });
    await waitFor(() => {
      expect(notebookApi.reStartNotebook).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'notebookToastSuccessTitle',
        description: 'reStartNotebookToastSuccessDescription',
      });
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('should call onError when API fails', async () => {
    vi.mocked(notebookApi.reStartNotebook).mockImplementation(() => {
      throw apiErrorMock;
    });
    render(<ReStartNotebook notebook={mockedNotebook} onError={onError} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    act(() => {
      fireEvent.click(screen.getByTestId('restart-notebook-submit-button'));
    });
    await waitFor(() => {
      expect(notebookApi.reStartNotebook).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'notebookToastErrorTitle',
        description: apiErrorMock.response.data.message,
        variant: 'destructive',
      });
      expect(onError).toHaveBeenCalled();
    });
  });
});
