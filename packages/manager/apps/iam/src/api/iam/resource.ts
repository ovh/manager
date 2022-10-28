import apiClient from '@ovh-ux/manager-core-api';

import { IamApiResource } from '../types';

export const listResource = async (): Promise<IamApiResource[]> => {
  const { data } = await apiClient.v2.get('/iam/resource');
  return data;
};

export default { listResource };
