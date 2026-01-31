import { Query } from '@/types/cloud/project/database/clickhouse/querystatistics/Query';

/** Cloud database clickhouse query statistics response body definition */
export interface QueryStatistics {
  /** Statistics of the queries */
  queries: Query[];
}
