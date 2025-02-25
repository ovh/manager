import { apiClient } from '@ovh-ux/manager-core-api';
import { describe, expect, vi } from 'vitest';
import {
  addJob,
  deleteJob,
  getCommand,
  getJob,
  getJobs,
  killJob,
} from './job.api';
import { mockedJobSpec } from '@/__tests__/helpers/mocks/job';

vi.mock('@ovh-ux/manager-core-api', () => {
  const get = vi.fn(() => {
    return Promise.resolve({ data: null });
  });
  const post = vi.fn(() => {
    return Promise.resolve({ data: null });
  });
  const put = vi.fn(() => {
    return Promise.resolve({ data: null });
  });
  const del = vi.fn(() => {
    return Promise.resolve({ data: null });
  });
  return {
    apiClient: {
      v6: {
        get,
        post,
        put,
        delete: del,
      },
    },
  };
});

describe('job functions', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call getJobs', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getJobs({
      projectId: 'projectId',
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/ai/job',
      {
        headers: {
          'X-Pagination-Mode': 'CachedObjectList-Pages',
          'X-Pagination-Size': '50000',
          Pragma: 'no-cache',
        },
      },
    );
  });

  it('should call getJob', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getJob({
      projectId: 'projectId',
      jobId: 'jobId',
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/ai/job/jobId',
    );
  });

  it('should call addJob', async () => {
    expect(apiClient.v6.post).not.toHaveBeenCalled();
    await addJob({
      projectId: 'projectId',
      jobInfo: mockedJobSpec,
    });
    expect(apiClient.v6.post).toHaveBeenCalledWith(
      '/cloud/project/projectId/ai/job',
      {
        image: 'image',
        name: 'name',
        region: 'region',
        resources: {
          cpu: 1,
          ephemeralStorage: 1,
          flavor: 'flavor',
          gpu: 1,
          memory: 1,
          privateNetwork: 1,
          publicNetwork: 1,
        },
      },
    );
  });

  it('should call killJob', async () => {
    expect(apiClient.v6.put).not.toHaveBeenCalled();
    await killJob({
      projectId: 'projectId',
      jobId: 'jobId',
    });
    expect(apiClient.v6.put).toHaveBeenCalledWith(
      '/cloud/project/projectId/ai/job/jobId/kill',
    );
  });

  it('should call deleteJob', async () => {
    expect(apiClient.v6.put).not.toHaveBeenCalled();
    await deleteJob({
      projectId: 'projectId',
      jobId: 'jobId',
    });
    expect(apiClient.v6.delete).toHaveBeenCalledWith(
      '/cloud/project/projectId/ai/job/jobId',
    );
  });

  it('should call getCommand', async () => {
    expect(apiClient.v6.post).not.toHaveBeenCalled();
    await getCommand({
      projectId: 'projectId',
      jobInfo: mockedJobSpec,
    });
    expect(apiClient.v6.post).toHaveBeenCalledWith(
      '/cloud/project/projectId/ai/job/command',
      {
        image: 'image',
        name: 'name',
        region: 'region',
        resources: {
          cpu: 1,
          ephemeralStorage: 1,
          flavor: 'flavor',
          gpu: 1,
          memory: 1,
          privateNetwork: 1,
          publicNetwork: 1,
        },
      },
    );
  });
});
