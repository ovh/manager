import { describe, it, expect, vi } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { mockedUsedNavigate } from '@/__tests__/helpers/mockRouterDomHelper';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedPublicGitVolume } from '@/__tests__/helpers/mocks/volume/volume';
import PublicGit from './PublicGit.component';
import { openButtonInMenu } from '@/__tests__/helpers/unitTestHelper';
import ai from '@/types/AI';

const onDelete = vi.fn();
describe('Public Git Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockedUsedNavigate();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders Public Git page', async () => {
    render(
      <PublicGit
        gitVolumes={[mockedPublicGitVolume]}
        updateMode={false}
        status={ai.notebook.NotebookStateEnum.STOPPED}
      />,
      {
        wrapper: RouterWithQueryClientWrapper,
      },
    );
    expect(screen.getByText(mockedPublicGitVolume.mountPath)).toBeTruthy();
  });

  it('renders and trigger copy mountpath in clipboard', async () => {
    Object.assign(window.navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    });
    render(
      <PublicGit
        gitVolumes={[mockedPublicGitVolume]}
        updateMode={false}
        status={ai.notebook.NotebookStateEnum.STOPPED}
      />,
      {
        wrapper: RouterWithQueryClientWrapper,
      },
    );
    await waitFor(() => {
      expect(screen.getByText(mockedPublicGitVolume.mountPath)).toBeTruthy();
    });
    await waitFor(() => {
      expect(screen.queryByTestId('add-public-git-button')).toBeNull();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('public-git-copy-mountpath-button'));
    });
    await waitFor(() => {
      expect(window.navigator.clipboard.writeText).toHaveBeenCalledWith(
        mockedPublicGitVolume.mountPath,
      );
    });
  });

  it('open public git modal on button click', async () => {
    render(
      <PublicGit
        gitVolumes={[mockedPublicGitVolume]}
        updateMode={true}
        onDelete={onDelete}
        status={ai.notebook.NotebookStateEnum.STOPPED}
      />,
      { wrapper: RouterWithQueryClientWrapper },
    );
    act(() => {
      fireEvent.click(screen.getByTestId('add-public-git-button'));
    });
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('./add-public-git');
    });
  });

  it('open delete public git modal', async () => {
    render(
      <PublicGit
        gitVolumes={[mockedPublicGitVolume]}
        updateMode={true}
        onDelete={onDelete}
        status={ai.notebook.NotebookStateEnum.STOPPED}
      />,
      { wrapper: RouterWithQueryClientWrapper },
    );
    await openButtonInMenu(
      'public-git-action-trigger',
      'public-git-action-delete-button',
    );
    await waitFor(() => {
      expect(onDelete).toHaveBeenCalledWith(mockedPublicGitVolume);
    });
  });
});
