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
import StopNotebook from './StopNotebook.component';

describe('Stop notebook modal', () => {
  beforeEach(() => {
    vi.mock('@/data/api/ai/notebook/notebook.api', () => ({
      getNotebooks: vi.fn(() => [mockedNotebook]),
      stopNotebook: vi.fn((notebook) => notebook),
    }));
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  const onSuccess = vi.fn();
  const onError = vi.fn();
  it('should open the modal', async () => {
    render(<StopNotebook notebook={mockedNotebook} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.queryByTestId('stop-notebook-modal')).toBeTruthy();
    });
  });

  it('should stop the notebook on submit', async () => {
    render(<StopNotebook notebook={mockedNotebook} onSuccess={onSuccess} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    act(() => {
      fireEvent.click(screen.getByTestId('stop-notebook-submit-button'));
    });
    await waitFor(() => {
      expect(notebookApi.stopNotebook).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'notebookToastSuccessTitle',
        description: 'stopNotebookToastSuccessDescription',
      });
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('should call onError when API fails', async () => {
    vi.mocked(notebookApi.stopNotebook).mockImplementation(() => {
      throw apiErrorMock;
    });
    render(<StopNotebook notebook={mockedNotebook} onError={onError} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    act(() => {
      fireEvent.click(screen.getByTestId('stop-notebook-submit-button'));
    });
    await waitFor(() => {
      expect(notebookApi.stopNotebook).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'notebookToastErrorTitle',
        description: apiErrorMock.response.data.message,
        variant: 'destructive',
      });
      expect(onError).toHaveBeenCalled();
    });
  });
});
