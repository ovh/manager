export const getZimbraPlatformOrganizationQueryKey = (
  platformId: string,
  searchParams?: string,
  shouldFetchAll?: boolean,
) =>
  [
    'get',
    'zimbra',
    'platform',
    platformId,
    'organizations',
    searchParams,
    shouldFetchAll ? 'all' : '',
  ].filter(Boolean);

export const getZimbraPlatformOrganizationDetailsQueryKey = (
  platformId: string,
  organizationId: string,
) => ['get', 'zimbra', 'platform', platformId, 'organization', organizationId];
