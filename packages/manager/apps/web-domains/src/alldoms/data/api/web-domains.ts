import { v6 } from '@ovh-ux/manager-core-api';
import { TServiceInfo, TServiceProperty } from '@/alldoms/types';

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
  const { data } = await v6.get(`/allDom/${serviceName}/serviceInfos`);
  return data;
};

/**
 *  : Terminate the domain
 */
export const updateAllDomService = async (
  serviceName: string,
  payload: { renew: TServiceInfo['renew'] },
): Promise<TServiceInfo> => {
  const { data } = await v6.put(`/allDom/${serviceName}/serviceInfos`, payload);

  return data;
};

export const updateDomainServiceInfo = async (domainName: string) => {
  const { data: domainServiceInfoId } = await v6.get<number[]>(
    `/services?resourceName=${domainName}`,
  );

  const promiseDomainServiceInfoId = domainServiceInfoId.map((id) =>
    v6
      .put(`/services/${id}`, {
        terminationPolicy: 'terminateAtExpirationDate',
      })
      .then((res) => res.data),
  );

  return promiseDomainServiceInfoId;
};
