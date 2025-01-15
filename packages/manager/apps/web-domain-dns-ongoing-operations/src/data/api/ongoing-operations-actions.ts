import { fetchIcebergV6, apiClient } from '@ovh-ux/manager-core-api';

//  Actions
export const operation = async (
  universe: string,
  id: number,
  operationType: string,
): Promise<any> => {
  return apiClient.v6.post(`/me/task/${universe}/${id}/${operationType}`);
};
