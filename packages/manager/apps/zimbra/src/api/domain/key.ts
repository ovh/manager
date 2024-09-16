export const getZimbraPlatformDomainsQueryKey = (
  platformId: string,
  organizationId?: string,
) => [
  `get/zimbra/platform/${platformId}/domain?organizationId=${organizationId}`,
];

export const getZimbraPlatformDomainQueryKey = (
  platformId: string,
  domainId: string,
) => [`get/zimbra/platform/${platformId}/domain/${domainId}`];

export const getDomainsZoneListQueryKey = ['get/domain/zone'];
