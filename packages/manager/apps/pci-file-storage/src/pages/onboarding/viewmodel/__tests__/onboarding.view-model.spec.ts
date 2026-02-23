import { Region } from '@ovh-ux/manager-config';
import { describe, expect, it } from 'vitest';

import { GUIDES } from '@/constants/Guides.constants';

import { getRegionGuides } from '../onboarding.view-model';

describe('getRegionGuides', () => {
  it('should return all guides for EU region', () => {
    expect(getRegionGuides(Region.EU)).toEqual(GUIDES);
  });

  it('should return all guides for CA region', () => {
    expect(getRegionGuides(Region.CA)).toEqual(GUIDES);
  });

  it('should return only get-started guide (others null) for US region', () => {
    const result = getRegionGuides(Region.US);

    expect(result).toHaveLength(GUIDES.length);
    expect(result[0]).toBeNull(); // learn-more → null
    expect(result[1]).toEqual(GUIDES[1]); // get-started → kept
    expect(result[2]).toBeNull(); // discord → null
  });
});
