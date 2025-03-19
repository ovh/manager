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
import { mockManagerReactShellClient } from '@/__tests__/helpers/mockShellHelper';
import * as notebookApi from '@/data/api/ai/notebook/notebook.api';
import { apiErrorMock } from '@/__tests__/helpers/mocks/shared/aiError';
import { mockedNotebook } from '@/__tests__/helpers/mocks/notebook/notebook';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import UpdateFlavor from './UpdateFlavor.modal';
import {
  mockedCapabilitiesFlavorCPU,
  mockedCapabilitiesFlavorGPU,
} from '@/__tests__/helpers/mocks/capabilities/flavor';
import { mockedCatalog } from '@/__tests__/helpers/mocks/catalog/catalog';
import ai from '@/types/AI';

describe('Update Flavor modal', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockManagerReactShellClient();
    vi.mock('@/pages/notebooks/[notebookId]/Notebook.context', () => ({
      useNotebookData: vi.fn(() => ({
        projectId: 'projectId',
        notebook: mockedNotebook,
        notebookQuery: {} as UseQueryResult<ai.notebook.Notebook, Error>,
      })),
    }));

    vi.mock('@/data/api/ai/notebook/notebook.api', () => ({
      updateNotebook: vi.fn(() => mockedNotebook),
    }));

    vi.mock('@/data/api/ai/capabilities/capabilities.api', () => ({
      getFlavor: vi.fn(() => [
        mockedCapabilitiesFlavorCPU,
        mockedCapabilitiesFlavorGPU,
      ]),
    }));

    vi.mock('@/data/api/catalog/catalog.api', () => ({
      catalogApi: {
        getCatalog: vi.fn(() => mockedCatalog),
      },
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders skeleton while loading', async () => {
    render(<UpdateFlavor />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('dialog-container')).toBeInTheDocument();
  });

  it('trigger onError on API Error', async () => {
    vi.mocked(notebookApi.updateNotebook).mockImplementation(() => {
      throw apiErrorMock;
    });
    render(<UpdateFlavor />, { wrapper: RouterWithQueryClientWrapper });
    act(() => {
      fireEvent.click(
        screen.getByTestId(
          `flavor-table-row-${mockedCapabilitiesFlavorGPU.id}`,
        ),
      );
      fireEvent.click(screen.getByTestId('update-flavor-submit-button'));
    });
    await waitFor(() => {
      expect(notebookApi.updateNotebook).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'updateFlavorToastErrorTitle',
        description: apiErrorMock.response.data.message,
        variant: 'destructive',
      });
    });
  });

  it('trigger onSuccess on summit click', async () => {
    render(<UpdateFlavor />, { wrapper: RouterWithQueryClientWrapper });
    act(() => {
      fireEvent.click(
        screen.getByTestId(
          `flavor-table-row-${mockedCapabilitiesFlavorGPU.id}`,
        ),
      );
      fireEvent.click(screen.getByTestId('update-flavor-submit-button'));
    });
    await waitFor(() => {
      expect(notebookApi.updateNotebook).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'updateFlavorToastSuccessTitle',
        description: 'updateFlavorToastSuccessDescription',
      });
    });
  });
});
