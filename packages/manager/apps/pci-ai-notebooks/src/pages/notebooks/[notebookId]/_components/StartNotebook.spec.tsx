import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from '@testing-library/react';
import * as notebookApi from '@/data/api/ai/notebook/notebook.api';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { useToast } from '@/components/ui/use-toast';
import { mockedNotebook } from '@/__tests__/helpers/mocks/notebook';
import { apiErrorMock } from '@/__tests__/helpers/mocks/aiError';
import StartNotebook from './StartNotebook.component';

describe('Start notebook modal', () => {
  beforeEach(() => {
    vi.mock('react-router-dom', async () => {
      const mod = await vi.importActual('react-router-dom');
      return {
        ...mod,
        useParams: () => ({
          projectId: 'projectId',
        }),
      };
    });
    vi.mock('react-i18next', () => ({
      useTranslation: () => ({
        t: (key: string) => key,
      }),
    }));
    vi.mock('@/data/api/ai/notebook/notebook.api', () => ({
      getNotebooks: vi.fn(() => [mockedNotebook]),
      startNotebook: vi.fn((notebook) => notebook),
    }));
    vi.mock('@/components/ui/use-toast', () => {
      const toastMock = vi.fn();
      return {
        useToast: vi.fn(() => ({
          toast: toastMock,
        })),
      };
    });
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  const onSuccess = vi.fn();
  const onError = vi.fn();
  it('should open the modal', async () => {
    render(<StartNotebook notebook={mockedNotebook} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.queryByTestId('start-notebook-modal')).toBeInTheDocument();
    });
  });

  it('should start the notebook on submit', async () => {
    render(<StartNotebook notebook={mockedNotebook} onSuccess={onSuccess} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    act(() => {
      fireEvent.click(screen.getByTestId('start-notebook-submit-button'));
    });
    await waitFor(() => {
      expect(notebookApi.startNotebook).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'notebookToastSuccessTitle',
        description: 'startNotebookToastSuccessDescription',
      });
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('should call onError when API fails', async () => {
    vi.mocked(notebookApi.startNotebook).mockImplementation(() => {
      throw apiErrorMock;
    });
    render(<StartNotebook notebook={mockedNotebook} onError={onError} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    act(() => {
      fireEvent.click(screen.getByTestId('start-notebook-submit-button'));
    });
    await waitFor(() => {
      expect(notebookApi.startNotebook).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'notebookToastErrorTitle',
        description: apiErrorMock.response.data.message,
        variant: 'destructive',
      });
      expect(onError).toHaveBeenCalled();
    });
  });
});
