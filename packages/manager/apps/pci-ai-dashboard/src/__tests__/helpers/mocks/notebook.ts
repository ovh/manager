import * as ai from '@/types/cloud/project/ai';
import { mockedJobStatus } from './job';
import { mockedDataSync } from './datasync';

export const mockedNotebookSpec: ai.notebook.NotebookSpec = {
  env: {
    editorId: 'editor',
    frameworkId: 'frameworkId',
    frameworkVersion: 'frameworkVersion',
  },
  envVars: [
    {
      name: 'envVarsName',
      value: 'envVarsValue',
    },
  ],
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
