import * as ai from '@/types/cloud/project/ai';
import { mockedJobStatus } from './job';

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
  dataSync: [
    {
      createdAt: 'createdAt',
      id: 'datasyncId',
      status: {
        info: {
          code: ai.InfoCodeEnum.APP_RUNNING,
          message: 'message',
        },
        progress: [
          {
            completed: 1,
            createdAt: 'createdAt',
            deleted: 0,
            direction: ai.volume.DataSyncEnum.push,
            failed: 0,
            id: 'progressId',
            info: 'info',
            processed: 3,
            skipped: 1,
            state: ai.volume.DataSyncProgressStateEnum.DONE,
            total: 2,
            transferredBytes: 30,
            updatedAt: 'updatedAt',
          },
        ],
        queuedAt: 'queuedAt',
        state: ai.volume.DataSyncStateEnum.DONE,
      },
      updatedAt: 'updatedAt',
    },
  ],

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
