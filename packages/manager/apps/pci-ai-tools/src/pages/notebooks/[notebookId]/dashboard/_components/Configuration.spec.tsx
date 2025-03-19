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
import { mockedUsedNavigate } from '@/__tests__/helpers/mockRouterDomHelper';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import Configurations from './Configuration.component';
import {
  mockedNotebook,
  mockedNotebookStatus,
} from '@/__tests__/helpers/mocks/notebook/notebook';
import ai from '@/types/AI';

describe('Configuration component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockedUsedNavigate();

    vi.mock('@/pages/notebooks/[notebookId]/Notebook.context', () => ({
      useNotebookData: vi.fn(() => ({
        projectId: 'projectId',
        notebook: {
          ...mockedNotebook,
          status: {
            ...mockedNotebookStatus,
            state: ai.notebook.NotebookStateEnum.STOPPED,
          },
        },
        serviceQuery: {} as UseQueryResult<ai.notebook.Notebook, Error>,
      })),
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders Configuration', async () => {
    render(<Configurations />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('configuration-container')).toBeInTheDocument();
  });

  it('renders and trigger copy Id in clipboard', async () => {
    Object.assign(window.navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    });
    render(<Configurations />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(mockedNotebook.id)).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('dashboard-copy-id-button'));
    });
    await waitFor(() => {
      expect(window.navigator.clipboard.writeText).toHaveBeenCalledWith(
        mockedNotebook.id,
      );
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'notebookIdCopyToast',
      });
    });
  });

  it('open delete notebook modal', async () => {
    render(<Configurations />, { wrapper: RouterWithQueryClientWrapper });
    expect(
      screen.getByTestId('notebook-config-delete-button'),
    ).not.toBeDisabled();
    act(() => {
      fireEvent.click(screen.getByTestId('notebook-config-delete-button'));
    });
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('./delete');
    });
  });
});
