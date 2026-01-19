import { TDisk } from '@/domain/entities/instancesCatalog';
import { TInstanceDisk } from '@/types/instance/entity.type';

type TDiskLike = {
  capacity: {
    value: number;
    unit: string;
  };
  number: number;
  interface?: string;
};

export type TDiskViewModel = {
  id: string;
  display: string;
};

const formatCapacity = (value: number, unit: string): string => {
  if (unit === 'GB' && value >= 1000) {
    const tbValue = (value / 1000).toFixed(2);
    return `${parseFloat(tbValue)} TB`;
  }
  return `${value}`;
};

export const mapDisksToViewModel = (
  disks: TDisk[] | TInstanceDisk[],
): TDiskViewModel[] => {
  if (disks.length === 0) {
    return [{ id: 'no-disk', display: '-' }];
  }

  return (disks as TDiskLike[]).map((disk, index) => {
    const capacityStr = formatCapacity(disk.capacity.value, disk.capacity.unit);
    const interfaceStr = disk.interface ? ` ${disk.interface}` : '';
    const display = `${disk.number}x ${capacityStr}${interfaceStr}`;
    const id = `${disk.number}_${disk.capacity.value}_${
      disk.capacity.unit
    }_${disk.interface || 'no-interface'}_${index}`;
    return { id, display };
  });
};
