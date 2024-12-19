export const getZimbraPlatformOrganizationQueryKey = (
  platformId: string,
  shouldFetchAll?: boolean,
) =>
  [
    'get',
    'organization',
    'zimbra',
    platformId,
    shouldFetchAll ? 'all' : '',
  ].filter(Boolean);

export const getZimbraPlatformOrganizationDetailsQueryKey = (
  platformId: string,
  organizationId: string,
) => ['get', 'organization', 'zimbra', platformId, organizationId];
