import { ConnectionPoolEdition } from '@/data/api/database/connectionPool.api';
import * as database from '@/types/cloud/project/database';

export const mockedConnectionPool: database.postgresql.ConnectionPool = {
  databaseId: 'databaseId',
  id: 'connectionPoolId',
  mode: database.postgresql.connectionpool.ModeEnum.session,
  name: 'connectionPoolName',
  port: 14123,
  size: 3,
  sslMode: database.postgresql.connectionpool.SslModeEnum.require,
  uri: 'uri',
  userId: 'userId',
};

export const mockedAddConnectionPool: database.postgresql.ConnectionPoolCreation = {
  databaseId: 'databaseId',
  mode: database.postgresql.connectionpool.ModeEnum.session,
  name: 'connectionPoolName',
  size: 3,
  userId: 'userId',
};

export const mockedEditConnectionPool: ConnectionPoolEdition = {
  id: 'connectionPoolId',
  databaseId: 'databaseId',
  mode: database.postgresql.connectionpool.ModeEnum.session,
  size: 3,
  userId: 'userId',
};
