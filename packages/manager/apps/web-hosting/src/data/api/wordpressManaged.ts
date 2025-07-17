import { v2 } from '@ovh-ux/manager-core-api';

export const getManagedCmsService = async (): Promise<string[]> => {
  const { data } = await v2.get<string[]>('/managedCMS/service');
  return data;
};
