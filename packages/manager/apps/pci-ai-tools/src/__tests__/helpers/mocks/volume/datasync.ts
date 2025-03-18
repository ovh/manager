import ai from '@/types/AI';

export const mockedDataSyncSpec: ai.volume.DataSyncSpec = {
  direction: ai.volume.DataSyncEnum.pull,
  manual: true,
  volume: '1934e1d3-2ba0-4000-8fd3-6f11081e4401',
};

export const mockedDataSync: ai.volume.DataSync = {
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
};
