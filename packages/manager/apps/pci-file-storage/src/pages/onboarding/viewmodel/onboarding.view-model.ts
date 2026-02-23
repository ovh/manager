import { Region } from '@ovh-ux/manager-config';

import { GUIDES } from '@/constants/Guides.constants';

export const getRegionGuides = (region: Region) => {
  if (region === Region.US) {
    return GUIDES.map((guide) => (guide.key === 'get-started' ? guide : null));
  }

  return GUIDES;
};
