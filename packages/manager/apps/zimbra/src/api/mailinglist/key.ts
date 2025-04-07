export const getZimbraPlatformMailingListsQueryKey = (
  platformId: string,
  searchParams?: string,
  shouldFetchAll?: boolean,
) =>
  [
    'get',
    'zimbra',
    'platform',
    platformId,
    'mailingLists',
    searchParams,
    shouldFetchAll ? 'all' : '',
  ].filter(Boolean);

export const getZimbraPlatformMailingListDetailsQueryKey = (
  platformId: string,
  mailingListId: string,
) => ['get', 'zimbra', 'platform', platformId, 'mailingList', mailingListId];
