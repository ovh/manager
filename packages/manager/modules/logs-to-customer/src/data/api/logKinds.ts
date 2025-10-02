import { fetchIcebergV6, v2 } from '@ovh-ux/manager-core-api';
import { LogKind } from '../types/dbaas/logs';
import { ApiUrls } from '../../LogsToCustomer.module';

/**
 * LIST log kinds
 */
export const getLogKindsV2 = async (logKindUrl: ApiUrls['logKind']) => {
  const { data } = await v2.get<LogKind[]>(logKindUrl);
  return data;
};

export const getLogKindsV6 = async (logKindUrl: ApiUrls['logKind']) => {
  const { data } = await fetchIcebergV6<LogKind>({
    route: logKindUrl,
    sortBy: 'name',
  });
  return data;
};
