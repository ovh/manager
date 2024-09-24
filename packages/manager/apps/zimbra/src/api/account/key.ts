export const getZimbraPlatformAccountsQueryKey = (
  platformId: string,
  queryParameters?: {
    organizationId?: string;
    domainId?: string;
  },
) => {
  const params = new URLSearchParams(queryParameters).toString();
  const queryString = params ? `?${params}` : '';
  return [`get/zimbra/platform/${platformId}/account${queryString}`];
};

export const getZimbraPlatformAccountDetailQueryKey = (
  platformId: string,
  accountId?: string,
) => [`get/zimbra/platform/${platformId}/account/${accountId}`];
