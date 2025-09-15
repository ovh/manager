import { v6 } from '@ovh-ux/manager-core-api';

import { WebSiteAttachedDomainDigStatusType } from '../types/product/website';

export const getWebHostingAttachedDomainDigStatusQueryKey = (
  serviceName: string,
  domain: string,
) => ['get', 'webhosting', serviceName, 'attachedDomain', domain, 'digStatus'];

export const getWebHostingAttachedDomainDigStatus = async (
  serviceName: string,
  domain: string,
): Promise<WebSiteAttachedDomainDigStatusType> => {
  const { data } = await v6.get<WebSiteAttachedDomainDigStatusType>(
    `/hosting/web/${serviceName}/attachedDomain/${domain}/digStatus`,
  );
  return data;
};
