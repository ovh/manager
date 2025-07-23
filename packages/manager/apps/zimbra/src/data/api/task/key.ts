export const getZimbraPlatformTaskQueryKey = (platformId: string, organizationId?: string) => [
  `get/zimbra/platform/${platformId}/task?organizationId=${organizationId}`,
];
