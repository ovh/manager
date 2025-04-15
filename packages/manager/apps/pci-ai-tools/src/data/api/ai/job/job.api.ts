import { apiClient } from '@ovh-ux/manager-core-api';
import ai from '@/types/AI';
import { JobData, PCIAi } from '../..';

export const getJobs = async ({ projectId }: PCIAi) =>
  apiClient.v6
    .get(`/cloud/project/${projectId}/ai/job`, {
      headers: {
        'X-Pagination-Mode': 'CachedObjectList-Pages',
        'X-Pagination-Size': '50000',
        Pragma: 'no-cache',
      },
    })
    .then((res) => res.data as ai.job.Job[]);

export const getJob = async ({ projectId, jobId }: JobData) =>
  apiClient.v6
    .get(`/cloud/project/${projectId}/ai/job/${jobId}`)
    .then((res) => res.data as ai.job.Job);

export interface AddJob extends PCIAi {
  jobInfo: ai.job.JobSpecInput;
}
export const addJob = async ({ projectId, jobInfo }: AddJob) =>
  apiClient.v6
    .post(`/cloud/project/${projectId}/ai/job`, jobInfo)
    .then((res) => res.data as ai.job.Job);

export const killJob = async ({ projectId, jobId }: JobData) => {
  return apiClient.v6
    .put(`/cloud/project/${projectId}/ai/job/${jobId}/kill`)
    .then((res) => res.data as ai.job.Job);
};

export const deleteJob = async ({ projectId, jobId }: JobData) =>
  apiClient.v6.delete(`/cloud/project/${projectId}/ai/job/${jobId}`);

export const getCommand = async ({ projectId, jobInfo }: AddJob) =>
  apiClient.v6
    .post(`/cloud/project/${projectId}/ai/job/command`, jobInfo)
    .then((res) => res.data as ai.Command);
