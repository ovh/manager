import { v2, v6 } from '@ovh-ux/manager-core-api';
import { TAllDomDomains, TServiceInfo } from '@/alldoms/types';
import {
  ServiceInfoUpdateEnum,
  ServiceRoutes,
} from '@/alldoms/enum/service.enum';

/**
 *  : Get this AllDom properties
 */
export const getServiceInformation = async (
  serviceName: string,
  serviceRoutes: string,
): Promise<TServiceInfo> => {
  const { data: serviceNameId } = await v6.get(
    `/services?resourceName=${serviceName}&routes=${serviceRoutes}`,
  );

  const { data } = await v6.get(`/services/${serviceNameId}`);
  return data;
};

export const getAllDomResource = async (serviceName: string) => {
  const { data } = await v2.get<TAllDomDomains>(
    `/domain/alldom/${serviceName}`,
  );
  return data;
};

/**
 *  : Update the service (terminate or cancel the terminate)
 */

export const updateService = async (
  serviceName: string,
  terminationPolicy: ServiceInfoUpdateEnum,
  serviceRoute: ServiceRoutes,
): Promise<TServiceInfo> => {
  // First call to retrieve serviceID in order to update it
  const { data: serviceId } = await v6.get(
    `/services?resourceName=${serviceName}&routes=${serviceRoute}`,
  );

  const { data } = await v6.put(`/services/${serviceId}`, {
    terminationPolicy,
  });
  return data;
};
