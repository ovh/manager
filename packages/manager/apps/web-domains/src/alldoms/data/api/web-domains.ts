import { aapi, v2, v6 } from '@ovh-ux/manager-core-api';
import {
  DomainBillingInformation,
  TAllDomDomains,
  TServiceInfo,
} from '@/alldoms/types';
import { ServiceInfoUpdateEnum } from '@/alldoms/enum/service.enum';

/**
 *  : List available AllDom services
 */
export const getAllDomList = async (): Promise<string[]> => {
  const { data } = await v6.get('/allDom');
  return data;
};

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
  serviceRoute: string,
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

export const getDomainBillingInformation = async (
  domainName: string,
): Promise<DomainBillingInformation> => {
  const { data } = await aapi.get(
    `/billing/services?search=${domainName}&type=DOMAIN`,
  );
  return data;
};
