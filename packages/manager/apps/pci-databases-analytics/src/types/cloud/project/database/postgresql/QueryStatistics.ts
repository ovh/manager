import { Query } from '@/types/cloud/project/database/postgresql/querystatistics/Query';

/** Cloud database postgresql query statistics response body definition */
export interface QueryStatistics {
  /** Statistics of the queries */
  queries?: Query[];
}
