import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { UseQueryResult } from '@tanstack/react-query';
import { useToast } from '@datatr-ux/uxlib';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import * as notebookAPI from '@/data/api/ai/notebook/notebook.api';
import * as datastoreHooks from '@/data/hooks/ai/data/useGetDatastoresWithContainers.hook';
import { apiErrorMock } from '@/__tests__/helpers/mocks/shared/aiError';
import { mockedNotebook } from '@/__tests__/helpers/mocks/notebook/notebook';
import AddVolume from './AddVolume.modal';
import { mockedDatastoreWithContainerGit } from '@/__tests__/helpers/mocks/volume/datastore';
import ai from '@/types/AI';

describe('Add Volume', () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    vi.mock('@/pages/notebooks/[notebookId]/Notebook.context', () => ({
      useNotebookData: vi.fn(() => ({
        projectId: 'projectId',
        notebook: mockedNotebook,
        serviceQuery: {} as UseQueryResult<ai.notebook.Notebook, Error>,
      })),
    }));

    vi.mock('@/data/hooks/ai/data/useGetDatastoresWithContainers.hook', () => ({
      useGetDatastoresWithContainers: vi.fn(),
    }));

    vi.mock('@/data/api/ai/notebook/notebook.api', () => ({
      updateNotebook: vi.fn(),
    }));

    vi.mocked(datastoreHooks.useGetDatastoresWithContainers).mockReturnValue({
      data: [mockedDatastoreWithContainerGit],
      refetchAll: () => vi.fn(),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders Add volume modal', async () => {
    render(<AddVolume />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('add-public-git-modal')).toBeInTheDocument();
  });

  it('trigger onError on API Error', async () => {
    vi.mocked(notebookAPI.updateNotebook).mockImplementation(() => {
      throw apiErrorMock;
    });
    render(<AddVolume />, { wrapper: RouterWithQueryClientWrapper });

    act(() => {
      fireEvent.change(screen.getByTestId('public-git-url-input-field'), {
        target: {
          value: 'https://url.git',
        },
      });
      fireEvent.change(
        screen.getByTestId('public-git-mount-path-input-field'),
        {
          target: {
            value: '/demooooo',
          },
        },
      );
    });
    act(() => {
      fireEvent.click(screen.getByTestId('add-public-git-submit-button'));
    });
    await waitFor(() => {
      expect(notebookAPI.updateNotebook).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'publicGitToastErrorTitle',
        description: apiErrorMock.response.data.message,
        variant: 'destructive',
      });
    });
  });

  it('trigger onSuccess on summit click', async () => {
    render(<AddVolume />, { wrapper: RouterWithQueryClientWrapper });
    act(() => {
      fireEvent.change(screen.getByTestId('public-git-url-input-field'), {
        target: {
          value: 'https://url.git',
        },
      });
      fireEvent.change(
        screen.getByTestId('public-git-mount-path-input-field'),
        {
          target: {
            value: '/demoooo',
          },
        },
      );
    });

    act(() => {
      fireEvent.click(screen.getByTestId('add-public-git-submit-button'));
    });
    await waitFor(() => {
      expect(notebookAPI.updateNotebook).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'publicGitToastSuccessTitle',
        description: 'addPublicGitToastSuccessDescription',
      });
    });
  });
});
