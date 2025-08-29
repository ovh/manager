export const getZimbraPlatformDomainsQueryKey = (
  platformId: string,
  searchParams?: string,
  shouldFetchAll?: boolean,
) =>
  [
    'get',
    'zimbra',
    'platform',
    platformId,
    'domains',
    searchParams,
    shouldFetchAll ? 'all' : '',
  ].filter(Boolean);

export const getZimbraPlatformDomainsDiagnosticQueryKey = (
  platformId: string,
  domainIds: string[],
) => ['get', 'zimbra', 'platform', platformId, 'domains', 'diagnostic', ...domainIds];

export const getZimbraPlatformDomainQueryKey = (platformId: string, domainId: string) => [
  'get',
  'zimbra',
  'platform',
  platformId,
  'domain',
  domainId,
];

export const getDomainsZoneListQueryKey = ['get', 'domain', 'zone'];

export const getDomainZoneByNameQueryKey = (name: string) => ['get', 'domain', 'zone', name];
