import { AxiosResponse } from 'axios';

import { apiClient } from '@ovh-ux/manager-core-api';

//  Actions
export const operation = async (
  universe: string,
  id: number,
  operationType: string,
): Promise<AxiosResponse> => {
  return apiClient.v6.post(`/me/task/${universe}/${id}/${operationType}`);
};
