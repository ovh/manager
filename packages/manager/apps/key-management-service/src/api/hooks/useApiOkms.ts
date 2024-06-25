import apiClient from '@ovh-ux/manager-core-api';
import { OKMS } from '@/interface';

export const getOKMSResource = async (
  okmsId: string,
): Promise<{ data: OKMS }> => {
  return apiClient.v2.get(`okms/resource/${okmsId}`);
};
