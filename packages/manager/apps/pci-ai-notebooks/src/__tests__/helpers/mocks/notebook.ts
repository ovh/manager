import * as ai from '@/types/cloud/project/ai';
import { NotebookEnv } from '@/types/cloud/project/ai/notebook/NotebookEnv';
import { mockedJobStatus } from './job';
import { mockedDataSync } from './datasync';
import { mockedVolume } from './volume';

const notebookEnv: NotebookEnv = {
  editorId: 'editor',
  frameworkId: 'frameworkId',
  frameworkVersion: 'frameworkVersion',
};

const jobEnv: ai.job.JobEnv = {
  name: 'envVarsName',
  value: 'envVarsValue',
};

export const mockedResources: ai.Resources = {
  cpu: 1,
  ephemeralStorage: 1,
  flavor: 'flavor',
  gpu: 1,
  memory: 1,
  privateNetwork: 1,
  publicNetwork: 1,
};

export const mockedNotebookSpec: ai.notebook.NotebookSpec = {
  env: notebookEnv,
  envVars: [jobEnv],
  name: 'name',
  region: 'region',
  resources: mockedResources,
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

export const mockedNotebookSpecInput: ai.notebook.NotebookSpecInput = {
  env: notebookEnv,
  envVars: [jobEnv],
  name: 'name',
  region: 'region',
  resources: mockedResources,
};
