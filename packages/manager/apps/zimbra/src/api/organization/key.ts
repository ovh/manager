export const getZimbraPlatformOrganizationQueryKey = (
  platformId: string,
  shouldFetchAll?: boolean,
) =>
  [
    'get',
    'zimbra',
    'platform',
    platformId,
    'organization',
    shouldFetchAll ? 'all' : '',
  ].filter(Boolean);

export const getZimbraPlatformOrganizationDetailsQueryKey = (
  platformId: string,
  organizationId: string,
) => ['get', 'zimbra', 'platform', platformId, 'organization', organizationId];
