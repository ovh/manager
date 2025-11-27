export const getZimbraPlatformRedirectionsQueryKey = (
  platformId: string,
  searchParams?: string,
  shouldFetchAll?: boolean,
) => {
  return [
    'get',
    'zimbra',
    'platform',
    platformId,
    'redirections',
    searchParams,
    shouldFetchAll ? 'all' : '',
  ].filter(Boolean);
};

export const getZimbraPlatformRedirectionQueryKey = (
  platformId: string,
  RedirectionId?: string,
) => ['get', 'zimbra', 'platform', platformId, 'Redirection', RedirectionId];
