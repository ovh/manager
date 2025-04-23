import { v2, v6 } from '@ovh-ux/manager-core-api';
import {
  TAllDomDomains,
  TServiceInfo,
  TServiceProperty,
  UpdateAllDomProps,
} from '@/alldoms/types';
import {
  ServiceInfoRenewMode,
  ServiceInfoUpdateEnum,
} from '@/alldoms/enum/service.enum';

/**
 *  : List available AllDom services
 */
export const getallDomList = async (): Promise<string[]> => {
  const { data } = await v6.get('/allDom');
  return data;
};

export const getAllDomProperty = async (
  serviceName: string,
): Promise<TServiceProperty> => {
  const { data } = await v6.get(`/allDom/${serviceName}`);
  return data;
};

/**
 *  : Get this AllDom properties
 */
export const getallDomService = async (
  serviceName: string,
): Promise<TServiceInfo> => {
  const { data: serviceNameId } = await v6.get(
    `/services?resourceName=${serviceName}`,
  );

  const { data } = await v6.get(`/services/${serviceNameId}`);
  return data;
};

export const getDomainAttachedToAllDom = async (serviceName: string) => {
  const { data } = await v2.get<TAllDomDomains>(
    `/domain/alldom/${serviceName}`,
  );
  return data;
};

/**
 *  : Terminate the domain
 */

export const updateAllDomService = async ({
  serviceName,
  ...payload
}: UpdateAllDomProps): Promise<TServiceInfo> => {
  const { data: allDomServiceId } = await v6.get(
    `/services?resourceName=${serviceName}`,
  );

  const { data } = await v6.put(`/services/${allDomServiceId}`, payload);
  return data;
};

export const updateDomainServiceInfo = async (domainName: string) => {
  const { data: domainServiceInfoId } = await v6.get<number[]>(
    `/services?resourceName=${domainName}`,
  );

  const promiseDomainServiceInfoId = await Promise.all(
    domainServiceInfoId.map(async (id) => {
      const { data } = await v6.put(`/services/${id}`, {
        displayName: domainName,
        renew: {
          mode: ServiceInfoRenewMode.Manual,
        },
        terminationPolicy: ServiceInfoUpdateEnum.TerminateAtEngagementDate,
      });
      return data;
    }),
  );

  return promiseDomainServiceInfoId;
};
