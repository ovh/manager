import {
  getAutoGeneratedName,
  getLocalZoneRegions,
  isLocalZoneRegion,
  paginateResults,
  isValidCidrMask,
  isValidIpAddress,
} from './utils';
import { TRegion } from '@/api/data/regions';

describe('getLocalZoneRegions', () => {
  it('should return local zone regions', () => {
    const regions = [
      { name: 'region1', type: 'localzone' },
      { name: 'region2', type: 'region' },
      { name: 'region3', type: 'localzone' },
    ] as TRegion[];
    const result = getLocalZoneRegions(regions);
    expect(result).toEqual([
      { name: 'region1', type: 'localzone' },
      { name: 'region3', type: 'localzone' },
    ]);
  });

  it('should return empty array if no local zone regions', () => {
    const regions = [
      { name: 'region1', type: 'region' },
      { name: 'region2', type: 'region' },
    ] as TRegion[];
    const result = getLocalZoneRegions(regions);
    expect(result).toEqual([]);
  });
});

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

describe('paginateResults', () => {
  it('should return paginated results', () => {
    const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const pagination = { pageIndex: 1, pageSize: 3 };
    const result = paginateResults(items, pagination);
    expect(result).toEqual({
      rows: [4, 5, 6],
      pageCount: 4,
      totalRows: 10,
    });
  });

  it('should return empty rows if no items', () => {
    const items = [];
    const pagination = { pageIndex: 1, pageSize: 3 };
    const result = paginateResults(items, pagination);
    expect(result).toEqual({
      rows: [],
      pageCount: 0,
      totalRows: 0,
    });
  });
});

describe('getAutoGeneratedName', () => {
  it('should return auto generated name with prefix', () => {
    const result = getAutoGeneratedName('prefix');
    expect(result).toMatch(/^prefix-\d+-\d+$/);
  });

  it('should return auto generated name without prefix', () => {
    const result = getAutoGeneratedName();
    expect(result).toMatch(/^\d+-\d+$/);
  });
});

describe('isValidCidrMask', () => {
  it('should return true when mask is between 1 to 32', () => {
    const result = isValidCidrMask(16);
    expect(result).toBe(true);
  });

  it('should return false when mask is less than 1', () => {
    const result = isValidCidrMask(0);
    expect(result).toBe(false);
  });

  it('should return false when mask is greater than 32', () => {
    const result = isValidCidrMask(33);
    expect(result).toBe(false);
  });
});

describe('isValidIpAddress', () => {
  it('should return true when IP is correct', () => {
    const result = isValidIpAddress('10.0.0.1');
    expect(result).toBe(true);
  });

  it('should return false when string has one more byte than correct IP', () => {
    const result = isValidIpAddress('172.0.0.0.1');
    expect(result).toBe(false);
  });

  it('should return false when string contain other character than correct IP', () => {
    const result = isValidIpAddress('172.0.0a');
    expect(result).toBe(false);
  });

  it('should return false when string contain a non octet', () => {
    const result = isValidIpAddress('172.0.259');
    expect(result).toBe(false);
  });
});
