import { v6 } from '@ovh-ux/manager-core-api';

export const getWebHostingAttachedDomainDigStatusQueryKey = (
  serviceName: string,
  domain: string,
) => ['get', 'webhosting', serviceName, 'attachedDomain', domain, 'digStatus'];

export const getWebHostingAttachedDomainDigStatus = async (
  serviceName: string,
  domain: string,
) => {
  const { data } = await v6.get(
    `/hosting/web/${serviceName}/attachedDomain/${domain}/digStatus`,
  );
  return data;
};
