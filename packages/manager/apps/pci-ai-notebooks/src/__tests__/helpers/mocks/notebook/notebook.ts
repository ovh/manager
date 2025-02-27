import * as ai from '@/types/cloud/project/ai';
import { NotebookEnv } from '@/types/cloud/project/ai/notebook/NotebookEnv';
import { mockedJobStatus } from '../job/job';
import { mockedDataSync } from '../volume/datasync';
import {
  mockedGitVolume,
  mockedPublicGitVolume,
  mockedS3Volume,
  mockedVolume,
} from '../volume/volume';
import { mockedCPUResources, mockedGPUResources } from '../shared/resource';

const notebookEnv: NotebookEnv = {
  editorId: 'jupyterlab',
  frameworkId: 'one-for-all',
  frameworkVersion: 'version',
};

const jobEnv: ai.job.JobEnv = {
  name: 'envVarsName',
  value: 'envVarsValue',
};

export const mockedNotebookSpec: ai.notebook.NotebookSpec = {
  env: notebookEnv,
  envVars: [jobEnv],
  name: 'name',
  region: 'region',
  resources: mockedCPUResources,
  volumes: [mockedVolume],
};

export const mockedNotebookStatus: ai.notebook.NotebookStatus = {
  dataSync: [mockedDataSync],
  info: {
    code: ai.InfoCodeEnum.JOB_DONE,
    message: 'message',
  },

  lastJobStatus: mockedJobStatus,
};

export const mockedNotebook: ai.notebook.Notebook = {
  createdAt: 'createdAt',
  id: 'notebookId',
  spec: mockedNotebookSpec,
  status: mockedNotebookStatus,
  updatedAt: 'updatedAt',
  user: 'user',
};

export const mockedNotebookGPU: ai.notebook.Notebook = {
  ...mockedNotebook,
  spec: {
    ...mockedNotebookSpec,
    resources: mockedGPUResources,
  },
};

export const mockedNotebookSpecInput: ai.notebook.NotebookSpecInput = {
  env: notebookEnv,
  name: 'myNewNotebook',
  region: 'GRA',
  unsecureHttp: false,
  resources: { flavor: 'ai1-1-cpu', cpu: 2 },
  labels: {
    test: 'testLabel',
  },
  sshPublicKeys: ['myNewSshKey'],
  volumes: [mockedS3Volume, mockedGitVolume],
};

export const mockedNotebookSpecInputGPU: ai.notebook.NotebookSpecInput = {
  ...mockedNotebookSpecInput,
  resources: { flavor: 'ai1-1-gpu', gpu: 2 },
  labels: {
    test: 'testLabel',
  },
  sshPublicKeys: ['myNewSshKey'],
  volumes: [mockedPublicGitVolume],
};
