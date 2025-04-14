import { v6 } from '@ovh-ux/manager-core-api';
import {
  DomainServiceType,
  ServiceInfosType,
  WebHostingType,
} from '@/data/type';

export const getHostingService = async (
  serviceName: string,
): Promise<WebHostingType> => {
  const { data } = await v6.get<WebHostingType>(`/hosting/web/${serviceName}`);
  return data;
};

export const getServiceInfos = async (
  serviceName: string,
): Promise<ServiceInfosType> => {
  const { data } = await v6.get<ServiceInfosType>(
    `/hosting/web/${serviceName}/serviceInfos`,
  );
  return data;
};

export const getDomainService = async (
  serviceName: string,
): Promise<DomainServiceType> => {
  const { data } = await v6.get<DomainServiceType>(`/domain/${serviceName}`);
  return data;
};

export const updateHostingService = async (
  serviceName: string,
  displayName: string,
) =>
  v6.put(`/hosting/web/${serviceName}`, {
    displayName,
  });
