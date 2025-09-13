export const getZimbraPlatformSlotsQueryKey = (
  platformId: string,
  searchParams?: string,
  shouldFetchAll?: boolean,
) => {
  return [
    'get',
    'zimbra',
    'platform',
    platformId,
    'slots',
    searchParams,
    shouldFetchAll ? 'all' : '',
  ].filter(Boolean);
};

export const getZimbraPlatformSlotQueryKey = (platformId: string, slotId?: string) => [
  'get',
  'zimbra',
  'platform',
  platformId,
  'slot',
  slotId,
];
