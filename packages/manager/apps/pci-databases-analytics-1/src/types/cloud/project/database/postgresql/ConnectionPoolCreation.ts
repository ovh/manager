import { ModeEnum } from '@/types/cloud/project/database/postgresql/connectionpool/ModeEnum';

/** Cloud database postgresql connection pool creation body definition */
export interface ConnectionPoolCreation {
  /** Database used for the connection pool */
  databaseId: string;
  /** Connection mode to the connection pool */
  mode: ModeEnum;
  /** Name of the connection pool */
  name: string;
  /** Size of the connection pool */
  size: number;
  /** User authorized to connect to the pool, if none all the users are allowed */
  userId: string;
}
