import apiClient, { ApiResponse } from '@ovh-ux/manager-core-api';
import { OKMS, OkmsPublicCa } from '@/types/okms.type';

export const okmsQueryKeys = {
  list: ['okms'],
  listDatagrid: ['okms', 'datagrid'],
  detail: (okmsId: string) => [...okmsQueryKeys.list, okmsId],
};

export const getOkms = async (okmsId: string): Promise<{ data: OKMS }> => {
  return apiClient.v2.get(`okms/resource/${okmsId}`);
};

export const getOkmsList = async () => {
  const { data }: ApiResponse<OKMS[]> = await apiClient.v2.get(`okms/resource`);
  return data;
};

export const getOkmsPublicCa = async (okmsId: string) => {
  const { data }: ApiResponse<OkmsPublicCa> = await apiClient.v2.get(
    `okms/resource/${okmsId}?publicCA=true`,
  );
  return data;
};
