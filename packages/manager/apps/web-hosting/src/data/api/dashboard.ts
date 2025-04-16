import { v6 } from '@ovh-ux/manager-core-api';

export const getHostingService = async (serviceName: string): Promise<any> => {
  const { data } = await v6.get<any>(`/hosting/web/${serviceName}`);
  return data;
};
