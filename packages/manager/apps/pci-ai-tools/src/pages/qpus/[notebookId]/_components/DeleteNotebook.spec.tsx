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
import DeleteNotebook from './DeleteNotebook.component';
import { apiErrorMock } from '@/__tests__/helpers/mocks/shared/aiError';

const onSuccess = vi.fn();
const onError = vi.fn();
describe('Delete notebook modal', () => {
  beforeEach(() => {
    vi.mock('@/data/api/ai/notebook/notebook.api', () => ({
      getNotebooks: vi.fn(() => [mockedNotebook]),
      deleteNotebook: vi.fn(),
    }));
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should open the modal', async () => {
    render(<DeleteNotebook notebook={mockedNotebook} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.queryByTestId('delete-notebook-modal')).toBeTruthy();
    });
  });

  it('should delete the notebook on submit', async () => {
    render(<DeleteNotebook notebook={mockedNotebook} onSuccess={onSuccess} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    act(() => {
      fireEvent.click(screen.getByTestId('delete-notebook-submit-button'));
    });
    await waitFor(() => {
      expect(notebookApi.deleteNotebook).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'notebookToastSuccessTitle',
        description: 'deleteNotebookToastSuccessDescription',
      });
    });
    expect(onSuccess).toHaveBeenCalled();
  });

  it('should call onError when API fails', async () => {
    vi.mocked(notebookApi.deleteNotebook).mockImplementation(() => {
      throw apiErrorMock;
    });
    render(<DeleteNotebook notebook={mockedNotebook} onError={onError} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    act(() => {
      fireEvent.click(screen.getByTestId('delete-notebook-submit-button'));
    });
    await waitFor(() => {
      expect(notebookApi.deleteNotebook).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'notebookToastErrorTitle',
        description: apiErrorMock.response.data.message,
        variant: 'destructive',
      });
      expect(onError).toHaveBeenCalled();
    });
  });
});
