export const getZimbraPlatformAccountsQueryKey = (
  platformId: string,
  searchParams?: string,
  shouldFetchAll?: boolean,
) => {
  return [
    'get',
    'zimbra',
    'platform',
    platformId,
    'accounts',
    searchParams,
    shouldFetchAll ? 'all' : '',
  ].filter(Boolean);
};

export const getZimbraPlatformAccountDetailQueryKey = (platformId: string, accountId?: string) => [
  'get',
  'zimbra',
  'platform',
  platformId,
  'account',
  accountId,
];
