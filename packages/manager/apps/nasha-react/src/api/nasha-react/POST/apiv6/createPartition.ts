import apiClient from '@ovh-ux/manager-core-api';
/*
type PostData = {
  partitionDescription: string | null;
  partitionName: string;
  size: number;
  protocol: string;
};
*/
// to fix type { QueryFunctionContext } from '@tanstack/react-query'
// eslint-disable-next-line
export default async function createNashaPartition({ queryKey }: any) {
  const { serviceName, data } = queryKey[1];
  const response = await apiClient.v6.post(
    `/dedicated/nasha/${serviceName}/partitions`,
    data,
  );
  return response.data;
}
