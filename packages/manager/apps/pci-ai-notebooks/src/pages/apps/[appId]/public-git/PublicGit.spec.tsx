import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { UseQueryResult } from '@tanstack/react-query';
import * as ai from '@/types/cloud/project/ai';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import PublicGit, { breadcrumb as Breadcrumb } from './PublicGit.page';
import { mockedPublicGitVolume } from '@/__tests__/helpers/mocks/volume';
import { useToast } from '@/components/ui/use-toast';
import { mockedApp, mockedAppSpec } from '@/__tests__/helpers/mocks/app';

const mockedNotebookBis: ai.app.App = {
  ...mockedApp,
  spec: {
    ...mockedAppSpec,
    volumes: [mockedPublicGitVolume],
  },
};

describe('Public Git page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    vi.mock('@/pages/apps/[appId]/App.context', () => ({
      useAppData: vi.fn(() => ({
        projectId: 'projectId',
        app: mockedNotebookBis,
        appQuery: {} as UseQueryResult<ai.app.App, Error>,
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
      expect(screen.getByText(translationKey)).toBeInTheDocument();
    });
  });

  it('renders Public Git page', async () => {
    render(<PublicGit />, { wrapper: RouterWithQueryClientWrapper });
    expect(
      screen.getByText(mockedPublicGitVolume.mountPath),
    ).toBeInTheDocument();
  });

  it('renders and trigger copy mountpath in clipboard', async () => {
    Object.assign(window.navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    });
    render(<PublicGit />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(
        screen.getByText(mockedPublicGitVolume.mountPath),
      ).toBeInTheDocument();
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
});
