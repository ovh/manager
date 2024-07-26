import { ModeEnum } from '@/types/cloud/project/database/postgresql/connectionpool/ModeEnum';
import { SslModeEnum } from '@/types/cloud/project/database/postgresql/connectionpool/SslModeEnum';

/** Cloud database postgresql connection pool response body definition */
export interface ConnectionPool {
  /** Database used for the connection pool */
  databaseId: string;
  /** ID of the connection pool */
  id?: string;
  /** Connection mode to the connection pool */
  mode: ModeEnum;
  /** Name of the connection pool */
  name?: string;
  /** Port of the connection pool */
  port?: number;
  /** Size of the connection pool */
  size: number;
  /** Ssl connection mode for the pool */
  sslMode?: SslModeEnum;
  /** Connection URI to the pool */
  uri?: string;
  /** User authorized to connect to the pool, if none all the users are allowed */
  userId?: string;
}
