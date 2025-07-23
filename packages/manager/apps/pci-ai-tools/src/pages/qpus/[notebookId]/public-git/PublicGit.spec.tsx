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
import { mockedUsedNavigate } from '@/__tests__/helpers/mockRouterDomHelper';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import {
  mockedNotebook,
  mockedNotebookSpec,
  mockedNotebookStatus,
} from '@/__tests__/helpers/mocks/notebook/notebook';
import PublicGit, { breadcrumb as Breadcrumb } from './PublicGit.page';
import { mockedPublicGitVolume } from '@/__tests__/helpers/mocks/volume/volume';
import { openButtonInMenu } from '@/__tests__/helpers/unitTestHelper';
import ai from '@/types/AI';

const mockedNotebookBis: ai.notebook.Notebook = {
  ...mockedNotebook,
  spec: {
    ...mockedNotebookSpec,
    volumes: [mockedPublicGitVolume],
  },
  status: {
    ...mockedNotebookStatus,
    volumes: [
      { id: 'volumeId', mountPath: '/demo', userVolumeId: 'useVoluId' },
    ],
  },
};

describe('Public Git page', () => {
  beforeEach(() => {
    mockedUsedNavigate();
    vi.restoreAllMocks();

    vi.mock('@/pages/notebooks/[notebookId]/Notebook.context', () => ({
      useNotebookData: vi.fn(() => ({
        projectId: 'projectId',
        notebook: mockedNotebookBis,
        serviceQuery: {} as UseQueryResult<ai.notebook.Notebook, Error>,
      })),
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the breadcrumb component', async () => {
    const translationKey = 'breadcrumb';
    render(<Breadcrumb />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(translationKey)).toBeTruthy();
    });
  });

  it('renders Public Git page', async () => {
    render(<PublicGit />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByText(mockedPublicGitVolume.mountPath)).toBeTruthy();
  });

  it('renders and trigger copy mountpath in clipboard', async () => {
    Object.assign(window.navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    });
    render(<PublicGit />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(mockedPublicGitVolume.mountPath)).toBeTruthy();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('public-git-copy-mountpath-button'));
    });
    await waitFor(() => {
      expect(window.navigator.clipboard.writeText).toHaveBeenCalledWith(
        mockedPublicGitVolume.mountPath,
      );
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'mountPathCopyToast',
      });
    });
  });

  it('open delete volume modal from action table button', async () => {
    render(<PublicGit />, { wrapper: RouterWithQueryClientWrapper });
    await openButtonInMenu(
      'public-git-action-trigger',
      'public-git-action-delete-button',
    );
    expect(mockedUsedNavigate).toHaveBeenCalledWith('./delete/volumeId');
  });
});
