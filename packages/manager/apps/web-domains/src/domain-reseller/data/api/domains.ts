import { TDomainResource } from '@/domain/types/domainResource';
import { v2 } from '@ovh-ux/manager-core-api';

export const getDomainsListByNicBilling = async (
  nicBilling: string,
): Promise<TDomainResource[]> => {
  const { data } = await v2.get('/domain/name', {
    params: { contactBilling: nicBilling },
  });
  return data;
};
