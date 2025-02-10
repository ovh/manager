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
    'zimbra',
    'platform',
    platformId,
    'account',
    queryString,
    shouldFetchAll ? 'all' : '',
  ].filter(Boolean);
};

export const getZimbraPlatformAccountDetailQueryKey = (
  platformId: string,
  accountId?: string,
) => ['get', 'zimbra', 'platform', platformId, 'account', accountId];
