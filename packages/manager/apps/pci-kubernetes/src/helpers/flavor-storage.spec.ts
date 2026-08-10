import { describe, expect, it } from 'vitest';

import { TFlavorDisk, selectLocalStorageDisks } from './flavor-storage';

describe('selectLocalStorageDisks', () => {
  const ssd: TFlavorDisk = {
    number: 2,
    capacity: 200,
    sizeUnit: 'GB',
    technology: 'SSD',
  };
  const nvme: TFlavorDisk = {
    number: 1,
    capacity: 100,
    sizeUnit: 'GB',
    technology: 'nvme-ssd',
  };

  it('returns an empty list when the flavor has no disk', () => {
    expect(selectLocalStorageDisks()).toEqual([]);
    expect(selectLocalStorageDisks([], [])).toEqual([]);
  });

  it('converts the disk capacity to bytes', () => {
    const [disk] = selectLocalStorageDisks([ssd]);

    expect(disk.capacityInBytes).toBe(200 * 10 ** 9);
    expect(disk.count).toBe(2);
  });

  it('counts a disk once when the catalog omits the disk number', () => {
    const [disk] = selectLocalStorageDisks(undefined, [
      { capacity: 100, sizeUnit: 'GB', technology: 'nvme-ssd' } as TFlavorDisk,
    ]);

    expect(disk.count).toBe(1);
    expect(disk.capacityInBytes).toBe(100 * 10 ** 9);
  });

  it('keeps the technology reported for a storage disk', () => {
    const [disk] = selectLocalStorageDisks([ssd]);

    expect(disk.technology).toBe('SSD');
  });

  it('normalises the technology of nvme disks', () => {
    const [disk] = selectLocalStorageDisks(undefined, [nvme]);

    expect(disk.technology).toBe('NVMe');
  });

  it('lists storage disks before nvme disks with unique ids', () => {
    const disks = selectLocalStorageDisks([ssd], [nvme]);

    expect(disks.map(({ technology }) => technology)).toEqual(['SSD', 'NVMe']);
    expect(new Set(disks.map(({ id }) => id)).size).toBe(2);
  });
});
