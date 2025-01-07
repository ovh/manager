export const getZimbraPlatformAccountsQueryKey = (
  platformId: string,
  queryParameters?: {
    organizationId?: string;
    domainId?: string;
  },
  shouldFetchAll?: boolean,
) => {
  const params = new URLSearchParams(queryParameters).toString();
  const queryString = params ? `?${params}` : '';
  return [
    'get',
    'account',
    'zimbra',
    platformId,
    queryString,
    shouldFetchAll ? 'all' : '',
  ].filter(Boolean);
};

export const getZimbraPlatformAccountDetailQueryKey = (
  platformId: string,
  accountId?: string,
) => ['get', 'account', 'zimbra', platformId, accountId];
