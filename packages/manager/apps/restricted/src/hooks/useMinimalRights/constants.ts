
export const MINIMAL_RIGHTS = [
  { urn: 'account:apiovh:me/get' },
  {
    urn: 'account:apiovh:me/supportLevel/get',
    subsidiariesExcluded: ['US'],
  },
  { urn: 'account:apiovh:me/certificates/get' },
  { urn: 'account:apiovh:me/tag/get' },
] as const;
