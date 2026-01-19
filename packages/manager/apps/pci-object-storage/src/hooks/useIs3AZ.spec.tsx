import { describe, it, expect } from 'vitest';
import { RegionTypeEnum } from '@datatr-ux/ovhcloud-types/cloud';
import { useIs3AZ } from './useIs3AZ.hook';
import { mockedStorageContainer } from '@/__tests__/helpers/mocks/storageContainer/storageContainer';
import { mockedRegion } from '@/__tests__/helpers/mocks/region/region';

describe('useIs3AZ', () => {
  it('should return true if region type is region-3-az', () => {
    const region3AZ = {
      ...mockedRegion,
      name: mockedStorageContainer.region,
      type: RegionTypeEnum['region-3-az'],
    };
    const regions = [region3AZ];
    expect(useIs3AZ(mockedStorageContainer, regions)).toBe(true);
  });

  it('should return false if region type is not region-3-az', () => {
    const regionNot3AZ = {
      ...mockedRegion,
      name: mockedStorageContainer.region,
      type: RegionTypeEnum.localzone,
    };
    const regions = [regionNot3AZ];
    expect(useIs3AZ(mockedStorageContainer, regions)).toBe(false);
  });
});
