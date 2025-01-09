type RIGHT = {
  urn: string;
  subsidiariesExcluded?: string[];
};

export const MINIMAL_RIGHTS: RIGHT[] = [
  { urn: 'account:apiovh:me/get' },
  {
    urn: 'account:apiovh:me/supportLevel/get',
    subsidiariesExcluded: ['US'],
  },
  { urn: 'account:apiovh:me/certificates/get' },
  { urn: 'ccount:apiovh:me/tag/get' },
] as const;
