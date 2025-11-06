import { describe, it, expect } from 'vitest';
import { createRegionWithAllInfo } from './storagesHelper';
import { mockedFormattedStorage } from '@/__tests__/helpers/mocks/storageContainer/storages';
import { mockedRegion } from '@/__tests__/helpers/mocks/region/region';
import { ObjectStorageTypeEnum } from '@/types/Storages';

describe('createRegionWithAllInfo', () => {
  it('should attach regionObj and set storageType to s3 if s3StorageType is present', () => {
    const containers = [mockedFormattedStorage];
    const regions = [mockedRegion];

    const result = createRegionWithAllInfo(containers, regions);

    expect(result).toHaveLength(1);
    expect(result[0].regionObj).toEqual(mockedRegion);
    expect(result[0].storageType).toBe(ObjectStorageTypeEnum.s3);
  });

  it('should handle empty containers array', () => {
    const result = createRegionWithAllInfo([], [mockedRegion]);
    expect(result).toEqual([]);
  });

  it('should handle empty regions array', () => {
    const containers = [mockedFormattedStorage];
    const result = createRegionWithAllInfo(containers, []);
    expect(result[0].regionObj).toBeUndefined();
  });
});
