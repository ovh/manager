import { v2 } from '@ovh-ux/manager-core-api';
import { TDomainResource } from '@/domain/types/domainResource';

/**
 *  : Get this Domain properties
 */
export const getDomainResource = async (
  serviceName: string,
): Promise<TDomainResource> => {
  const { data } = await v2.get(`/domain/name/${serviceName}`);
  return data;
};
