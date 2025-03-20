import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { mockedUsedNavigate } from '@/__tests__/helpers/mockRouterDomHelper';
import { mockManagerReactShellClient } from '@/__tests__/helpers/mockShellHelper';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedNotebook } from '@/__tests__/helpers/mocks/notebook/notebook';
import Notebooks from './Notebooks.page';
import { openButtonInMenu } from '@/__tests__/helpers/unitTestHelper';

describe('Notebooks List page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockedUsedNavigate();
    mockManagerReactShellClient();

    vi.mock('@/data/api/ai/notebook/notebook.api', () => ({
      getNotebooks: vi.fn(() => [mockedNotebook]),
      startNotebook: vi.fn((notebook) => notebook),
      stopNotebook: vi.fn((notebook) => notebook),
      deleteNotebook: vi.fn(),
    }));
  });

  it('should display Notebooks pages and skeleton', async () => {
    render(<Notebooks />, { wrapper: RouterWithQueryClientWrapper });
    expect(
      screen.getByTestId('notebook-list-table-skeleton'),
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByTestId('guide-skeleton')).toBeInTheDocument();
    });
  });

  it('should display notebooks list table and add button', async () => {
    render(<Notebooks />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('create-notebook-button')).toBeInTheDocument();
      expect(screen.getByText(mockedNotebook.id)).toBeInTheDocument();
      expect(screen.getByText(mockedNotebook.spec.name)).toBeInTheDocument();
    });
  });

  it('open start notebook modal from action table button', async () => {
    render(<Notebooks />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(mockedNotebook.id)).toBeInTheDocument();
    });
    await openButtonInMenu(
      'notebooks-action-trigger',
      'notebook-action-start-button',
    );
    expect(mockedUsedNavigate).toHaveBeenCalledWith('./start/notebookId');
  });

  it('open stop notebook modal from action table button', async () => {
    render(<Notebooks />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(mockedNotebook.id)).toBeInTheDocument();
    });
    await openButtonInMenu(
      'notebooks-action-trigger',
      'notebook-action-stop-button',
    );
    expect(mockedUsedNavigate).toHaveBeenCalledWith('./stop/notebookId');
  });

  it('open delete notebook Modal from action table button', async () => {
    render(<Notebooks />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(mockedNotebook.id)).toBeInTheDocument();
    });
    await openButtonInMenu(
      'notebooks-action-trigger',
      'notebook-action-delete-button',
    );
    expect(mockedUsedNavigate).toHaveBeenCalledWith('./delete/notebookId');
  });

  it('go to manage notebook from action table button', async () => {
    render(<Notebooks />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(mockedNotebook.id)).toBeInTheDocument();
    });
    await openButtonInMenu(
      'notebooks-action-trigger',
      'notebook-action-manage-button',
    );
    expect(mockedUsedNavigate).toHaveBeenCalledWith('./notebookId');
  });
});
