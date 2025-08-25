export const getZimbraPlatformAliasesQueryKey = (
  platformId: string,
  searchParams?: string,
  shouldFetchAll?: boolean,
) => {
  return [
    'get',
    'zimbra',
    'platform',
    platformId,
    'aliases',
    searchParams,
    shouldFetchAll ? 'all' : '',
  ].filter(Boolean);
};

export const getZimbraPlatformAliasQueryKey = (platformId: string, aliasId?: string) => [
  'get',
  'zimbra',
  'platform',
  platformId,
  'alias',
  aliasId,
];
