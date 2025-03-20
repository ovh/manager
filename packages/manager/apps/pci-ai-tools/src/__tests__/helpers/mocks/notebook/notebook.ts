import ai from '@/types/AI';

import {
  mockedGitVolume,
  mockedPublicGitVolume,
  mockedS3Volume,
  mockedVolume,
} from '../volume/volume';
import { mockedCPUResources, mockedGPUResources } from '../shared/resource';
import { mockedSshKey } from '../sshkey';
import { mockedDataSync } from '../volume/datasync';
import { mockedJobStatus } from '../job/job';

const notebookEnv: ai.notebook.NotebookEnv = {
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
  state: ai.notebook.NotebookStateEnum.STOPPED,
  lastJobStatus: mockedJobStatus,
};

export const mockedNotebookUpdateInput: ai.notebook.NotebookUpdate = {
  labels: { key: 'label' },
  resources: mockedCPUResources,
  sshPublicKeys: [mockedSshKey.publicKey],
  unsecureHttp: false,
  volumes: [mockedVolume],
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
