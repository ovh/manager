import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { useToast } from '@datatr-ux/uxlib';
import { UseQueryResult } from '@tanstack/react-query';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import {
  mockedNotebook,
  mockedNotebookSpec,
} from '@/__tests__/helpers/mocks/notebook/notebook';
import Labels from './Labels.component';
import * as labelsApi from '@/data/api/ai/notebook/label/label.api';
import ai from '@/types/AI';

describe('Configuration component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    vi.mock('@/pages/notebooks/[notebookId]/Notebook.context', () => ({
      useNotebookData: vi.fn(() => ({
        projectId: 'projectId',
        notebook: {
          ...mockedNotebook,
          spec: {
            ...mockedNotebookSpec,
            labels: { key: 'value' },
          },
        },
        serviceQuery: {} as UseQueryResult<ai.notebook.Notebook, Error>,
      })),
    }));

    vi.mock('@/data/api/ai/notebook/label/label.api', () => ({
      editLabel: vi.fn((labels) => labels),
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders Configuration', async () => {
    render(<Labels />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('labels-container')).toBeTruthy();
  });

  it('trigger add label onSuccess', async () => {
    render(<Labels />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('labels-container')).toBeTruthy();
    expect(screen.getByTestId('label-add-button')).toBeTruthy();

    act(() => {
      fireEvent.change(screen.getByTestId('key-input-field'), {
        target: {
          value: 'newKey',
        },
      });
      fireEvent.change(screen.getByTestId('value-input-field'), {
        target: {
          value: 'newValue',
        },
      });
      fireEvent.click(screen.getByTestId('label-add-button'));
    });

    await waitFor(() => {
      expect(labelsApi.editLabel).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'labelToastSuccessTitle',
      });
    });
  });

  it('trigger delete label onSuccess', async () => {
    render(<Labels />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('labels-container')).toBeTruthy();
    expect(screen.getByTestId('button_key')).toBeTruthy();
    act(() => {
      fireEvent.click(screen.getByTestId('button_key'));
    });

    await waitFor(() => {
      expect(labelsApi.editLabel).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'labelToastSuccessTitle',
      });
    });
  });
});
