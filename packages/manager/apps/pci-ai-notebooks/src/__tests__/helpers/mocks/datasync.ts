import * as ai from '@/types/cloud/project/ai';

export const mockedDataSyncSpec: ai.volume.DataSyncSpec = {
  direction: ai.volume.DataSyncEnum.pull,
  volume: '1934e1d3-2ba0-4000-8fd3-6f11081e4401',
};

export const mockedDataSync: ai.volume.DataSync = {
  createdAt: 'createdAt',
  id: 'idDuDataSync',
  spec: {
    direction: ai.volume.DataSyncEnum.pull,
    volume: '1934e1d3-2ba0-4000-8fd3-6f11081e4401',
  },
  updatedAt: 'updatedAt',
};
