export const getZimbraPlatformDomainsQueryKey = (
  platformId: string,
  organizationId?: string,
) => [
  `get/zimbra/platform/${platformId}/domain?organizationId=${organizationId}`,
];

export const getDomainsZoneListQueryKey = ['get/domain/zone'];
