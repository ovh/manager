import { v6 } from '@ovh-ux/manager-core-api';
import { TDomainZone } from '@/domain/types/domainZone';
/**
 *  : Get Zone attached to Domain Service
 */
export const getDomainZone = async (
  serviceName: string,
): Promise<TDomainZone> => {
  const { data } = await v6.get(`/domain/zone/${serviceName}`);
  return data;
};
