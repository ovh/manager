export const getZimbraPlatformAliasQueryKey = (platformId: string) => {
  return ['get', 'zimbra', 'platform', platformId, 'aliases'];
};

export const getZimbraPlatformAliasDetailQueryKey = (
  platformId: string,
  aliasId: string,
) => ['get', 'zimbra', 'platform', platformId, 'alias', aliasId];
