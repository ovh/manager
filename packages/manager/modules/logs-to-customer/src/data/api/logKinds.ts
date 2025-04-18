import { fetchIcebergV2, apiClient } from '@ovh-ux/manager-core-api';
import { LogKind } from '../types/dbaas/logs';
import { ApiUrls } from '../../LogsToCustomer.module';

/**
 * LIST log kinds
 */
export const getLogKindsv2 = async (logKindUrl: ApiUrls['logKind']) => {
  const { data } = await fetchIcebergV2<LogKind>({
    route: logKindUrl,
  });
  return data;
};

export const getLogKindsv6 = async (logKindUrl: ApiUrls['logKind']) => {
  const { data } = await apiClient.v6.get<string[]>(logKindUrl);
  return data.sort().map(
    (kind) =>
      ({
        name: kind,
        displayName: kind,
        kindId: kind,
      } as LogKind),
  );
};
