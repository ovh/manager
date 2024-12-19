export const getZimbraPlatformDomainsQueryKey = (
  platformId: string,
  organizationId?: string,
) => ['get', 'domain', 'zimbra', platformId, organizationId];

export const getZimbraPlatformDomainsDiagnosticQueryKey = (
  platformId: string,
  domainIds: string[],
) => ['get', 'domain', 'zimbra', platformId, 'diagnostic', ...domainIds];

export const getZimbraPlatformDomainQueryKey = (
  platformId: string,
  domainId: string,
) => ['get', 'domain', 'zimbra', platformId, domainId];

export const getDomainsZoneListQueryKey = ['get', 'domain', 'zones'];

export const getDomainZoneByNameQueryKey = (name: string) => [
  'get',
  'domain',
  'zone',
  name,
];
