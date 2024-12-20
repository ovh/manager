export const getZimbraPlatformAccountsQueryKey = (
  platformId: string,
  queryParameters?: {
    organizationId?: string;
    domainId?: string;
  },
) => {
  const params = new URLSearchParams(queryParameters).toString();
  const queryString = params ? `?${params}` : '';
  return ['get', 'account', 'platform', platformId, queryString];
};

export const getZimbraPlatformAccountDetailQueryKey = (
  platformId: string,
  accountId?: string,
) => ['get', 'account', 'platform', platformId, accountId];
