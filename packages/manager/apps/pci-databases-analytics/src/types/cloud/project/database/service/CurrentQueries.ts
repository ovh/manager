import { Query } from '@/types/cloud/project/database/service/currentqueries/Query';

/** Cloud database current queries */
export interface CurrentQueries {
  /** Current queries list */
  queries?: Query[];
}
