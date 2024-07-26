import * as database from '@/types/cloud/project/database';

export const mockedNamespaces: database.m3db.Namespace = {
  id: 'namespaceId',
  name: 'namespaceName',
  retention: {
    blockDataExpirationDuration: 'PT3M',
    blockSizeDuration: 'PT5H',
    bufferFutureDuration: 'PT6H',
    bufferPastDuration: 'PT8H',
    periodDuration: 'P8D',
  },
  resolution: 'PT4H',
  snapshotEnabled: true,
  type: database.m3db.namespace.TypeEnum.unaggregated,
  writesToCommitLogEnabled: true,
};

export const mockedAddNamespace: database.m3db.NamespaceCreation = {
  name: 'namespaceName',
  retention: {
    blockDataExpirationDuration: '3m',
    blockSizeDuration: '5H',
    bufferFutureDuration: '6D',
    bufferPastDuration: '8H',
    periodDuration: '1Y',
  },
  resolution: '2Y',
  snapshotEnabled: true,
  type: database.m3db.namespace.TypeEnum.unaggregated,
  writesToCommitLogEnabled: true,
};

export const mockedEditNamespace: Omit<
  database.m3db.Namespace,
  'name' | 'type'
> = {
  id: 'namespaceId',
  retention: {
    blockDataExpirationDuration: '3m',
    blockSizeDuration: '5H',
    bufferFutureDuration: '6D',
    bufferPastDuration: '8H',
    periodDuration: '1Y',
  },
  resolution: '2Y',
  snapshotEnabled: true,
  writesToCommitLogEnabled: true,
};
