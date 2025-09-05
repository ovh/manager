import { aapi, v2, v6 } from '@ovh-ux/manager-core-api';
import {
  DomainBillingInformation,
  TAllDomDomains,
  TServiceInfo,
  UpdateAllDomProps,
} from '@/alldoms/types';
import {
  ServiceInfoUpdateEnum,
} from '@/alldoms/enum/service.enum';
import { ServiceInfoRenewModeEnum } from '@/common/enum/common.enum';

/**
 *  : List available AllDom services
 */
export const getAllDomList = async (): Promise<string[]> => {
  const { data } = await v6.get('/allDom');
  return data;
};

export const getAllDomResource = async (serviceName: string) => {
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
  // First call to retrieve serviceID in order to update it
  const { data: allDomServiceId } = await v6.get(
    `/services?resourceName=${serviceName}`,
  );

  const { data } = await v6.put(`/services/${allDomServiceId}`, payload);
  return data;
};

export const updateDomainServiceInfo = async (
  domainName: string,
): Promise<TServiceInfo[]> => {
  // First call to retrieve serviceID in order to update it
  const { data: domainServiceInfoId } = await v6.get<number[]>(
    `/services?resourceName=${domainName}`,
  );

  const promiseDomainServiceInfoId = await Promise.all(
    domainServiceInfoId.map(async (id) => {
      const { data } = await v6.put(`/services/${id}&routes=/domain`, {
        displayName: domainName,
        renew: {
          mode: ServiceInfoRenewModeEnum.Manual,
        },
        terminationPolicy: ServiceInfoUpdateEnum.TerminateAtExpirationDate,
      });
      return data;
    }),
  );

  return promiseDomainServiceInfoId;
};

export const getDomainBillingInformation = async (
  domainName: string,
): Promise<DomainBillingInformation> => {
  const { data } = await aapi.get(
    `/billing/services?search=${domainName}&type=DOMAIN`,
  );
  return data;
};
