import apiClient from '@ovh-ux/manager-core-api';
import { QueryFunctionContext } from '@tanstack/react-query';

export default async function createNashaPartition({
  queryKey,
}: QueryFunctionContext<[string, { serviceName: string }]>) {
  const { serviceName } = queryKey[1];
  const response = await apiClient.v6.post(
    `/dedicated/nasha/${serviceName}/partitions`,
  );
  return response.data;
}
