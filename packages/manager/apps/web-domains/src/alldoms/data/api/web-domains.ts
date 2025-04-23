import { v6 } from '@ovh-ux/manager-core-api';
import {
  TAllDomDomains,
  TDomainDetail,
  TServiceInfo,
  TServiceProperty,
} from '@/alldoms/types';
import { ServiceInfoRenewMode } from '@/alldoms/enum/service.enum';

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

export const getAllDomainAttachedToAllDom = async (
  serviceName: string,
): Promise<string[]> => {
  const { data } = await v6.get(`/allDom/${serviceName}/domain`);
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

/**
 *  : Get current domain properties
 */

export const getDomainDetail = async (
  domainName: string,
): Promise<TDomainDetail> => {
  const { data } = await v6.get(`/domain/${domainName}`);
  return data;
};

/**
 *  : Terminate the domain
 */
export const updateAllDomService = async (
  serviceName: string,
  renew: {
    mode: ServiceInfoRenewMode;
  },
): Promise<TServiceInfo> => {
  const { data: allDomServiceId } = await v6.get(
    `/services?resourceName=${serviceName}`,
  );

  const { data } = await v6.put(`/services/${allDomServiceId}`, renew);
  return data;
};

export const updateDomainServiceInfo = async (domainName: string) => {
  const { data: domainServiceInfoId } = await v6.get<number[]>(
    `/services?resourceName=${domainName}`,
  );

  const promiseDomainServiceInfoId = await Promise.all(
    domainServiceInfoId.map(async (id) => {
      const { data } = await v6.put(`/services/${id}`, {
        terminationPolicy: 'terminateAtExpirationDate',
      });
      return data;
    }),
  );

  return promiseDomainServiceInfoId;
};

export const getDomainDetailInformation = async (serviceName: string) => {
  const { data } = await v6.get<TAllDomDomains>(
    `/allDom/${serviceName}/domainInfo`,
  );
  return data;
};
