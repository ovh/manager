export const getZimbraPlatformMailingListsQueryKey = (
  platformId: string,
  queryParameters?: {
    organizationId?: string;
    organizationLabel?: string;
  },
) => {
  const params = new URLSearchParams(queryParameters).toString();
  return ['get', 'zimbra', 'platform', platformId, 'mailingLists', params];
};

export const getZimbraPlatformMailingListDetailsQueryKey = (
  platformId: string,
  mailingListId: string,
) => ['get', 'zimbra', 'platform', platformId, 'mailingList', mailingListId];
