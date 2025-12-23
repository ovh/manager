import { OKMS, OkmsPublicCa } from '@key-management-service/types/okms.type';

import apiClient, { ApiResponse } from '@ovh-ux/manager-core-api';

export const okmsQueryKeys = {
  list: ['okms'],
  listDatagrid: ['okms', 'datagrid'],
  detail: (okmsId: string) => [...okmsQueryKeys.list, okmsId],
};

export const getOkms = async (okmsId: string): Promise<OKMS> => {
  const { data } = await apiClient.v2.get<OKMS>(`okms/resource/${okmsId}`);
  return data;
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
