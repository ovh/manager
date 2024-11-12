import { getLocalZoneRegions, isLocalZoneRegion } from './utils';
import { TRegion } from '@/api/data/regions';

describe('isLocalZoneRegion', () => {
  it('should return true if region is local zone', () => {
    const regions = [
      { name: 'region1', type: 'localzone' },
      { name: 'region2', type: 'region' },
    ] as TRegion[];
    const result = isLocalZoneRegion(getLocalZoneRegions(regions), 'region1');
    expect(result).toBe(true);
  });

  it('should return false if region is not local zone', () => {
    const regions = [
      { name: 'region1', type: 'localzone' },
      { name: 'region2', type: 'region' },
    ] as TRegion[];
    const result = isLocalZoneRegion(getLocalZoneRegions(regions), 'region2');
    expect(result).toBe(false);
  });
});
