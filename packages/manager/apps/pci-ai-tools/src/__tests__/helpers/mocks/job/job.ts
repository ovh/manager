import * as ai from '@datatr-ux/ovhcloud-types/cloud/project/ai/index';
import { mockedDataSync } from '../volume/datasync';
import { mockedCPUResources, mockedGPUResources } from '../shared/resource';
import {
  mockedGitVolume,
  mockedPublicGitVolume,
  mockedS3Volume,
} from '../volume/volume';

export const mockedJobSpec: ai.job.JobSpec = {
  image: 'sentiment-analysis-image',
  name: 'my-new-job',
  region: 'GRA',
  resources: mockedCPUResources,
};
export const mockedJobStatus: ai.job.JobStatus = {
  dataSync: [mockedDataSync],
  history: [
    {
      date: '2024-12-12T16:27:46.65022Z',
      state: ai.job.JobStateEnum.DONE,
    },
  ],
  info: {
    code: ai.InfoCodeEnum.JOB_DONE,
    message: 'message',
  },
};

export const mockedJob: ai.job.Job = {
  createdAt: '2024-12-12T16:27:46.65022Z',
  id: 'jobId',
  spec: mockedJobSpec,
  status: mockedJobStatus,
  updatedAt: '2024-12-12T16:27:46.65022Z',
  user: 'user',
};

export const mockedJobGPU: ai.job.Job = {
  ...mockedJob,
  spec: {
    ...mockedJobSpec,
    resources: mockedGPUResources,
  },
};

export const mockedJobSpecInput: ai.job.JobSpecInput = {
  name: 'myNewJob',
  region: 'GRA',
  image: 'myImage',
  resources: { flavor: 'ai1-1-cpu', cpu: 2 },
  sshPublicKeys: ['myNewSshKey'],
  unsecureHttp: false,
  command: ['command', 'docker'],
  volumes: [mockedS3Volume, mockedGitVolume],
};

export const mockedJobSpecInputGPU: ai.job.JobSpecInput = {
  ...mockedJobSpecInput,
  resources: { flavor: 'ai1-1-gpu', gpu: 2 },
  volumes: [mockedPublicGitVolume],
};
