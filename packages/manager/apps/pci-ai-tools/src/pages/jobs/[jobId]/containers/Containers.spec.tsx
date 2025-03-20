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
import { mockManagerReactShellClient } from '@/__tests__/helpers/mockShellHelper';
import { mockedUsedNavigate } from '@/__tests__/helpers/mockRouterDomHelper';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedDatastoreVolume } from '@/__tests__/helpers/mocks/volume/volume';
import Containers, { breadcrumb as Breadcrumb } from './Containers.page';
import { openButtonInMenu } from '@/__tests__/helpers/unitTestHelper';
import {
  mockedJob,
  mockedJobSpec,
  mockedJobStatus,
} from '@/__tests__/helpers/mocks/job/job';

const mockedJobWithVol: ai.job.Job = {
  ...mockedJob,
  spec: {
    ...mockedJobSpec,
    volumes: [mockedDatastoreVolume],
  },
  status: {
    ...mockedJobStatus,
    state: ai.job.JobStateEnum.RUNNING,
    volumes: [
      {
        id: 'volumeId',
        mountPath: '/demo1',
        userVolumeId: 'userVolumeId',
      },
    ],
  },
};

describe('Containers page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockedUsedNavigate();
    mockManagerReactShellClient();
    vi.mock('@/pages/jobs/[jobId]/Job.context', () => ({
      useJobData: vi.fn(() => ({
        projectId: 'projectId',
        job: mockedJobWithVol,
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
      expect(screen.getByText(translationKey)).toBeInTheDocument();
    });
  });

  it('renders and trigger copy mountpath in clipboard', async () => {
    Object.assign(window.navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    });
    render(<Containers />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(
        screen.getByText(mockedDatastoreVolume.mountPath),
      ).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('containers-copy-mountpath-button'));
    });
    await waitFor(() => {
      expect(window.navigator.clipboard.writeText).toHaveBeenCalledWith(
        mockedDatastoreVolume.mountPath,
      );
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'mountPathCopyToast',
      });
    });
  });

  it('open data sync modal on button click', async () => {
    render(<Containers />, { wrapper: RouterWithQueryClientWrapper });
    act(() => {
      fireEvent.click(screen.getByTestId('general-data-sync-button'));
    });
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('./data-sync');
    });
  });

  it('open data sync modal from action table button', async () => {
    render(<Containers />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(
        screen.getByText(mockedDatastoreVolume.mountPath),
      ).toBeInTheDocument();
    });
    await openButtonInMenu(
      'container-action-trigger',
      'container-action-data-sync-button',
    );
    expect(mockedUsedNavigate).toHaveBeenCalledWith('./data-sync/volumeId');
  });
});
