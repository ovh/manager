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
      id: 'idDuDataSync',
      spec: {
        direction: ai.volume.DataSyncEnum.pull,
        manual: true,
        volume: '1934e1d3-2ba0-4000-8fd3-6f11081e4401',
      },
      status: {
        endedAt: 'endedAT',
        info: {
          code: ai.InfoCodeEnum.APP_ERROR,
          message: 'error_message',
        },
        progress: [
          {
            completed: 1,
            createdAt: 'createdAt',
            deleted: 1,
            direction: ai.volume.DataSyncEnum.pull,
            failed: 3,
            id: 'id',
            info: 'info',
            processed: 1,
            skipped: 1,
            state: ai.volume.DataSyncProgressStateEnum.DONE,
            total: 1,
            transferredBytes: 1,
            updatedAt: 'updatedAt',
          },
        ],
        queuedAt: 'queudAt',
        startedAt: 'startedAt',
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
