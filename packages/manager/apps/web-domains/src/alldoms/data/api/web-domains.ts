import { apiClient } from '@ovh-ux/manager-core-api';
import { TServiceInfo } from '@/alldoms/types';

/**
 *  : List available AllDom services
 */
export const getallDomList = async (): Promise<[]> =>
  apiClient.v6.get('/allDom').then((res) => res.data);

/**
 *  : Get this AllDom properties
 */
export const getallDomService = async (
  serviceName: string,
): Promise<TServiceInfo> =>
  apiClient.v6
    .get(`/allDom/${serviceName}/serviceInfos`)
    .then((res) => res.data);
