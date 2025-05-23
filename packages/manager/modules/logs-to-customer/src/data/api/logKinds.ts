import { fetchIcebergV6, v2 } from '@ovh-ux/manager-core-api';
import { LogKind } from '../types/dbaas/logs';
import { ApiUrls } from '../../LogsToCustomer.module';

/**
 * LIST log kinds
 */
export const getLogKindsv2 = async (logKindUrl: ApiUrls['logKind']) => {
  const { data } = await v2.get<LogKind[]>(logKindUrl);
  return data;
};

export const getLogKindsv6 = async (logKindUrl: ApiUrls['logKind']) => {
  const { data } = await fetchIcebergV6<LogKind>({
    route: logKindUrl,
  });
  return data;
};
