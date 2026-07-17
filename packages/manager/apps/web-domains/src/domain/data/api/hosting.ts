import { v6 } from '@ovh-ux/manager-core-api';
import { TServiceInfo } from '@/common/types/common.types';

export const getAssociatedHosting = async (
  serviceName: string,
): Promise<string[]> => {
  const { data } = await v6.get(
    `hosting/web/attachedDomain?domain=${serviceName}`,
  );
  return data;
};

export const getFreeHostingService = async (
  serviceName: string,
): Promise<TServiceInfo> => {
  const { data: serviceId } = await v6.get(
    `services/?routes=/hosting/web&resourceName=${serviceName}`,
  );

  const { data: serviceDetails } = await v6.get(`services/${serviceId}`);
  return serviceDetails;
};

export const getAssociatedSubDomainsMultiSite = async (
  hostingName: string,
): Promise<string[]> => {
  const { data } = await v6.get(`hosting/web/${hostingName}/attachedDomain`);
  return data;
};
