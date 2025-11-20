import { describe, it, expect } from 'vitest';
import { RegionTypeEnum } from '@datatr-ux/ovhcloud-types/cloud';
import { useIsLocaleZone } from './useIsLocalZone.hook';
import { mockedStorageContainer } from '@/__tests__/helpers/mocks/storageContainer/storageContainer';
import { mockedRegion } from '@/__tests__/helpers/mocks/region/region';

describe('useIsLocaleZone', () => {
  it('should return true if regions is undefined', () => {
    expect(useIsLocaleZone(mockedStorageContainer, undefined as any)).toBe(
      true,
    );
  });

  it('should return true if region type is localzone', () => {
    const localZoneRegion = {
      ...mockedRegion,
      name: mockedStorageContainer.region,
      type: RegionTypeEnum.localzone,
    };
    const regions = [localZoneRegion];
    expect(useIsLocaleZone(mockedStorageContainer, regions)).toBe(true);
  });

  it('should return false if region type is not localzone', () => {
    const notLocalZoneRegion = {
      ...mockedRegion,
      name: mockedStorageContainer.region,
      type: RegionTypeEnum['region-3-az'],
    };
    const regions = [notLocalZoneRegion];
    expect(useIsLocaleZone(mockedStorageContainer, regions)).toBe(false);
  });
});
