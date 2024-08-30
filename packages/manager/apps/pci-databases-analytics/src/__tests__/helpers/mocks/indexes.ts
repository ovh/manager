import * as database from '@/types/cloud/project/database';

export const mockedIndex: database.opensearch.Index = {
  id: 'indexId',
  name: 'myIndex',
  createdAt: '2024-08-30T09:21:37.423Z',
  documents: 56,
  replicasNumber: 4,
  shardsNumber: 16,
  size: 1024,
};
