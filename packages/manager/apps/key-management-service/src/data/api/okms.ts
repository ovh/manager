import apiClient, { ApiResponse } from '@ovh-ux/manager-core-api';
import { OKMS, OkmsPublicCa } from '@/types/okms.type';

export const getOkmsResourceQueryKey = (okmsId: string) => [
  `get/okms/resource/${okmsId}`,
];

export const getOkmsServicesResourceListQueryKey = ['get/okms/resource'];

export const getOkmsResource = async (
  okmsId: string,
): Promise<{ data: OKMS }> => {
  return apiClient.v2.get(`okms/resource/${okmsId}`);
};

export const getOkmsPublicCa = async (
  okmsId: string,
): Promise<OkmsPublicCa> => {
  const { data }: ApiResponse<OkmsPublicCa> = await apiClient.v2.get(
    `okms/resource/${okmsId}?publicCA=true`,
  );
  return data;
};
