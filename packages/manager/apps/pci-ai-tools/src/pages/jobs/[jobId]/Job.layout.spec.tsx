import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import JobLayout, {
  breadcrumb as Breadcrumb,
  Loader,
} from '@/pages/jobs/[jobId]/Job.layout';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import * as jobAPI from '@/data/api/ai/job/job.api';
import ai from '@/types/AI';
import {
  mockedDatastoreVolume,
  mockedPublicGitVolume,
} from '@/__tests__/helpers/mocks/volume/volume';
import {
  mockedJob,
  mockedJobSpec,
  mockedJobStatus,
} from '@/__tests__/helpers/mocks/job/job';

const loaderParam = {
  params: {
    projectId: 'projectId',
    jobId: 'jobId',
  },
  request: new Request('https://my-api.com/endpoint'),
};

const mockedJobWithVol: ai.job.Job = {
  ...mockedJob,
  spec: {
    ...mockedJobSpec,
    volumes: [mockedDatastoreVolume, mockedPublicGitVolume],
    unsecureHttp: true,
    name: 'jobName',
  },
  status: {
    ...mockedJobStatus,
    state: ai.job.JobStateEnum.RESTARTING,
  },
};

describe('Job Layout', () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    vi.mock('react-router-dom', async () => {
      const mod = await vi.importActual('react-router-dom');
      return {
        ...mod,
        useParams: () => ({
          projectId: 'projectId',
          jobId: 'jobId',
        }),
      };
    });

    vi.mock('@/data/api/ai/job/job.api', () => ({
      getJob: vi.fn(() => mockedJob),
    }));
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders loader function', async () => {
    Loader(loaderParam);
    await waitFor(() => {
      expect(jobAPI.getJob).toHaveBeenCalled();
    });
  });

  it('renders skeleton of job Layout', async () => {
    render(<JobLayout />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.getByText('dashboardTab')).toBeTruthy();
    });
  });

  it('renders breadcrumb', async () => {
    render(<Breadcrumb />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.getByText(mockedJob.spec.name)).toBeTruthy();
    });
  });

  it('renders fully service layout', async () => {
    vi.mocked(jobAPI.getJob).mockImplementationOnce(async () => {
      return mockedJob;
    });
    render(<JobLayout />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.getByTestId('job-header-container')).toBeTruthy();
    });
    expect(screen.getByText(mockedJob.spec.name)).toBeTruthy();
  });

  it('renders fully service layout', async () => {
    vi.mocked(jobAPI.getJob).mockImplementationOnce(async () => {
      return mockedJobWithVol;
    });
    render(<JobLayout />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.getByTestId('job-header-container')).toBeTruthy();
      expect(screen.getByText(mockedJobWithVol.spec.name)).toBeTruthy();
    });
  });
});
