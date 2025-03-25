import { v6 } from '@ovh-ux/manager-core-api';
import { TServiceInfo, TServiceProperty } from '@/alldoms/types';

/**
 *  : List available AllDom services
 */
export const getallDomList = async (): Promise<string[]> =>
  v6.get('/allDom').then((res) => res.data);

export const getAllDomProperty = async (
  serviceName: string,
): Promise<TServiceProperty> =>
  v6.get(`/allDom/${serviceName}`).then((res) => res.data);

export const getAllDomainAttachedToAllDom = async (
  serviceName: string,
): Promise<string[]> =>
  v6.get(`/allDom/${serviceName}/domain`).then((res) => res.data);

/**
 *  : Get this AllDom properties
 */
export const getallDomService = async (
  serviceName: string,
): Promise<TServiceInfo> =>
  v6.get(`/allDom/${serviceName}/serviceInfos`).then((res) => res.data);
