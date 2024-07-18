export const getZimbraPlatformOrganizationQueryKey = (platformId: string) => [
  `get/zimbra/platform/${platformId}/organization`,
];

export const getZimbraPlatformOrganizationDetailsQueryKey = (
  platformId: string,
  organizationId: string,
) => [`get/zimbra/platform/${platformId}/organization/${organizationId}`];
