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
import ai from '@/types/AI';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import * as notebookAPI from '@/data/api/ai/notebook/notebook.api';
import * as datastoreHooks from '@/data/hooks/ai/data/useGetDatastoresWithContainers.hook';
import { apiErrorMock } from '@/__tests__/helpers/mocks/shared/aiError';
import { handleSelectComboboxText } from '@/__tests__/helpers/unitTestHelper';
import { mockedNotebook } from '@/__tests__/helpers/mocks/notebook/notebook';
import AddVolume from './AddVolume.modal';
import { mockedDatastoreWithContainerS3 } from '@/__tests__/helpers/mocks/volume/datastore';

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
      data: [mockedDatastoreWithContainerS3],
      refetchAll: () => vi.fn(),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders Add volume modal', async () => {
    render(<AddVolume />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('add-volume-modal')).toBeTruthy();
  });

  it('trigger onError on API Error', async () => {
    vi.mocked(notebookAPI.updateNotebook).mockImplementation(() => {
      throw apiErrorMock;
    });
    render(<AddVolume />, { wrapper: RouterWithQueryClientWrapper });
    // Select S3 Datastore
    await handleSelectComboboxText(
      'select-datastore-container-button',
      mockedDatastoreWithContainerS3.id,
    );

    await waitFor(() => {
      expect(screen.getByTestId('select-container-combobox')).toBeTruthy();
    });

    // Select Container
    await handleSelectComboboxText(
      'select-container-combobox',
      mockedDatastoreWithContainerS3.container[0],
    );

    // add a value in MountPath
    act(() => {
      fireEvent.change(screen.getByTestId('mount-directory-input-field'), {
        target: {
          value: '/mynewpath',
        },
      });
    });
    act(() => {
      fireEvent.click(screen.getByTestId('add-container-submit-button'));
    });
    await waitFor(() => {
      expect(notebookAPI.updateNotebook).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'addContainerToastErrorTitle',
        description: apiErrorMock.response.data.message,
        variant: 'destructive',
      });
    });
  });

  it('trigger onSuccess on summit click', async () => {
    render(<AddVolume />, { wrapper: RouterWithQueryClientWrapper });
    // Select S3 Datastore
    await handleSelectComboboxText(
      'select-datastore-container-button',
      mockedDatastoreWithContainerS3.id,
    );

    await waitFor(() => {
      expect(screen.getByTestId('select-container-combobox')).toBeTruthy();
    });

    // Select Container
    await handleSelectComboboxText(
      'select-container-combobox',
      mockedDatastoreWithContainerS3.container[0],
    );

    // add a value in MountPath
    act(() => {
      fireEvent.change(screen.getByTestId('mount-directory-input-field'), {
        target: {
          value: '/mynewpath',
        },
      });
    });
    act(() => {
      fireEvent.click(screen.getByTestId('add-container-submit-button'));
    });
    await waitFor(() => {
      expect(notebookAPI.updateNotebook).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'addContainerToastSuccessTitle',
        description: 'addContainerToastSuccessDescription',
      });
    });
  });
});
