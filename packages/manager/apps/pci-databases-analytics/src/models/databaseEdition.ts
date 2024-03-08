import { database } from './database';

export interface ConnectionPoolEdition {
  /** Database used for the connection pool */
  databaseId: string;
  /** Connection mode to the connection pool */
  mode: database.postgresql.connectionpool.ModeEnum;
  /** Size of the connection pool */
  size: number;
  /** User authorized to connect to the pool, if none all the users are allowed */
  userId?: string;
}
