import { Query } from '@/types/cloud/project/database/mysql/querystatistics/Query';

/** Cloud database mysql query statistics response body definition */
export interface QueryStatistics {
  /** Statistics of the queries */
  queries?: Query[];
}
