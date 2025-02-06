export const getZimbraPlatformDomainsQueryKey = (
  platformId: string,
  organizationId?: string,
  shouldFetchAll?: boolean,
) =>
  [
    'get',
    'zimbra',
    'platform',
    platformId,
    'domain',
    shouldFetchAll ? 'all' : '',
    organizationId,
  ].filter(Boolean);

export const getZimbraPlatformDomainsDiagnosticQueryKey = (
  platformId: string,
  domainIds: string[],
) => [
  'get',
  'zimbra',
  'platform',
  platformId,
  'domain',
  'diagnostic',
  ...domainIds,
];

export const getZimbraPlatformDomainQueryKey = (
  platformId: string,
  domainId: string,
) => ['get', 'zimbra', 'platform', platformId, 'domain', domainId];

export const getDomainsZoneListQueryKey = ['get', 'domain', 'zone'];

export const getDomainZoneByNameQueryKey = (name: string) => [
  'get',
  'domain',
  'zone',
  name,
];
