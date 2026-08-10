import {
  diskCapacityToBytes,
  TDiskViewModel,
} from './mappers/diskMapper';

export const toDiskCount = (number: number): number =>
  Number.isFinite(number) && number > 0 ? number : 1;

export const diskCapacityInBytes = (disk: TDiskViewModel): number =>
  diskCapacityToBytes(disk.capacityValue, disk.capacityUnit);

export const selectLocalDisks = (disks: TDiskViewModel[]): TDiskViewModel[] =>
  disks.filter((disk) => disk.id !== 'no-disk');
