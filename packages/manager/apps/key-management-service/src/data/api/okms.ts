import apiClient from '@ovh-ux/manager-core-api';
import { OKMS } from '@/types/okms.type';

export const getOkmsResourceQueryKey = (okmsId: string) => [
  `get/okms/resource/${okmsId}`,
];

export const getOkmsServicesResourceListQueryKey = ['get/okms/resource'];

export const getOKMSResource = async (
  okmsId: string,
): Promise<{ data: OKMS }> => {
  return apiClient.v2.get(`okms/resource/${okmsId}`);
};
