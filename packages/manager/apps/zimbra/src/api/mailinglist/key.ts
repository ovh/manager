export const getZimbraPlatformMailingListsQueryKey = (
  platformId: string,
  queryParameters?: {
    organizationId?: string;
    organizationLabel?: string;
  },
) => {
  const params = new URLSearchParams(queryParameters).toString();
  const queryString = params ? `?${params}` : '';
  return [`get/zimbra/platform/${platformId}/mailingList${queryString}`];
};

export const getZimbraPlatformMailingListDetailsQueryKey = (
  platformId: string,
  mailingListId: string,
) => [`get/zimbra/platform/${platformId}/mailingList/${mailingListId}`];
