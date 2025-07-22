import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { useParams } from 'react-router-dom';
import { UseQueryResult } from '@tanstack/react-query';
import { useToast } from '@datatr-ux/uxlib';
import ai from '@/types/AI';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import * as notebookAPI from '@/data/api/ai/notebook/notebook.api';
import { apiErrorMock } from '@/__tests__/helpers/mocks/shared/aiError';
import { mockedNotebook } from '@/__tests__/helpers/mocks/notebook/notebook';
import DeleteVolume from './DeleteVolume.modal';

describe('Delete Volume', () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    vi.mock('react-router-dom', async () => {
      const mod = await vi.importActual('react-router-dom');
      return {
        ...mod,
        useParams: vi.fn(),
      };
    });

    vi.mock('@/pages/notebooks/[notebookId]/Notebook.context', () => ({
      useNotebookData: vi.fn(() => ({
        projectId: 'projectId',
        notebook: mockedNotebook,
        serviceQuery: {} as UseQueryResult<ai.notebook.Notebook, Error>,
      })),
    }));

    vi.mock('@/data/api/ai/notebook/notebook.api', () => ({
      updateNotebook: vi.fn(),
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders Delete volume modal', async () => {
    vi.mocked(useParams).mockReturnValue({ volumeId: 'volumeId' });
    render(<DeleteVolume />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('delete-container-modal')).toBeTruthy();
  });

  it('trigger onError on API Error', async () => {
    vi.mocked(useParams).mockReturnValue({ volumeId: 'volumeId' });
    vi.mocked(notebookAPI.updateNotebook).mockImplementation(() => {
      throw apiErrorMock;
    });
    render(<DeleteVolume />, { wrapper: RouterWithQueryClientWrapper });
    act(() => {
      fireEvent.click(screen.getByTestId('delete-container-submit-button'));
    });
    await waitFor(() => {
      expect(notebookAPI.updateNotebook).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'containerToastErrorTitle',
        description: apiErrorMock.response.data.message,
        variant: 'destructive',
      });
    });
  });

  it('trigger onSuccess on summit click', async () => {
    vi.mocked(useParams).mockReturnValue({ volumeId: 'volumeId' });
    render(<DeleteVolume />, { wrapper: RouterWithQueryClientWrapper });
    act(() => {
      fireEvent.click(screen.getByTestId('delete-container-submit-button'));
    });
    await waitFor(() => {
      expect(notebookAPI.updateNotebook).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'containerToastSuccessTitle',
        description: 'deleteContainerToastSuccessDescription',
      });
    });
  });
});
