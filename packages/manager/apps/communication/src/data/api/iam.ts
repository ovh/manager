import apiClient from '@ovh-ux/manager-core-api';
import { IamResource } from '../types';

export const getAccountUrn = async (): Promise<string> => {
  const { data = [] } = await apiClient.v2.get<IamResource[]>(
    '/iam/resource?resourceType=account',
  );

  return data[0]?.urn;
};
