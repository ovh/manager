import { Ip } from '@/types/Ip';
import { StateEnum } from '@/types/cloud/project/database/service/currentqueries/StateEnum';
import { WaitEventTypeEnum } from '@/types/cloud/project/database/service/currentqueries/WaitEventTypeEnum';

/** Cloud database service current queries query definition */
export interface Query {
  /** Application name */
  applicationName?: string;
  /** Backend start timestamp */
  backendStart?: string;
  /** Backend type */
  backendType?: string;
  /** XID for current backend */
  backendXid?: number;
  /** Xmin for current backend */
  backendXmin?: number;
  /** Client hostname */
  clientHostname?: string;
  /** Client ip address */
  clientIp?: Ip;
  /** Client port */
  clientPort?: number;
  /** Database ID */
  databaseId?: number;
  /** Database name */
  databaseName?: string;
  /** Leader process ID */
  leaderPid?: number;
  /** Connection process ID */
  pid?: number;
  /** Current query running on this connection */
  query?: string;
  /** Duration of the query in seconds */
  queryDuration?: number;
  /** Query start timestamp */
  queryStart?: string;
  /** Connection state */
  state?: StateEnum;
  /** Connection state change timestamp */
  stateChange?: string;
  /** Transaction start timestamp */
  transactionStart?: string;
  /** User ID */
  userId?: number;
  /** User name */
  userName?: string;
  /** Connection wait event */
  waitEvent?: string;
  /** Connection wait event type */
  waitEventType?: WaitEventTypeEnum;
}
