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
import ai from '@/types/AI';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import PublicGit, { breadcrumb as Breadcrumb } from './PublicGit.page';
import { mockedPublicGitVolume } from '@/__tests__/helpers/mocks/volume/volume';
import { mockedJob, mockedJobSpec } from '@/__tests__/helpers/mocks/job/job';

const mockedNotebookBis: ai.job.Job = {
  ...mockedJob,
  spec: {
    ...mockedJobSpec,
    volumes: [mockedPublicGitVolume],
  },
};

describe('Public Git page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    vi.mock('@/pages/jobs/[jobId]/Job.context', () => ({
      useJobData: vi.fn(() => ({
        projectId: 'projectId',
        job: mockedNotebookBis,
        jobQuery: {} as UseQueryResult<ai.job.Job, Error>,
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
});
