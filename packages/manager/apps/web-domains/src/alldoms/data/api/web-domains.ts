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
