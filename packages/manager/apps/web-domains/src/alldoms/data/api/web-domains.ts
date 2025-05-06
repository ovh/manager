import { v6 } from '@ovh-ux/manager-core-api';
import { TServiceInfo } from '@/alldoms/types';

/**
 *  : List available AllDom services
 */
export const getallDomList = async (): Promise<[]> =>
  v6.get('/allDom').then((res) => res.data);

/**
 *  : Get this AllDom properties
 */
export const getallDomService = async (
  serviceName: string,
): Promise<TServiceInfo> =>
  v6.get(`/allDom/${serviceName}/serviceInfos`).then((res) => res.data);
