export const getZimbraPlatformDomainsQueryKey = (
  platformId: string,
  organizationId?: string,
  shouldFetchAll?: boolean,
) =>
  [
    'get',
    'zimbra',
    'domain',
    platformId,
    shouldFetchAll ? 'all' : '',
    organizationId,
  ].filter(Boolean);

export const getZimbraPlatformDomainQueryKey = (
  platformId: string,
  domainId: string,
) => ['get', 'domain', 'zimbra', platformId, domainId];

export const getDomainsZoneListQueryKey = ['get', 'domain', 'zone'];
