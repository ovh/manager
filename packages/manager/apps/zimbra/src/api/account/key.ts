export const getZimbraPlatformAccountsQueryKey = (
  platformId: string,
  queryParameters?: {
    organizationId?: string;
    domainId?: string;
  },
  shouldFetchAll?: boolean,
) => {
  const params = new URLSearchParams(queryParameters).toString();
  return [
    'get',
    'zimbra',
    'platform',
    platformId,
    'accounts',
    shouldFetchAll ? 'all' : '',
    params,
  ].filter(Boolean);
};

export const getZimbraPlatformAccountDetailQueryKey = (
  platformId: string,
  accountId?: string,
) => ['get', 'zimbra', 'platform', platformId, 'account', accountId];
