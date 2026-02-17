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
  display?: string;
  number: number;
  capacityValue: number;
  capacityUnit: 'gb' | 'tb';
  interface: string | null;
};

const GB_TO_TB_THRESHOLD = 1000;

export const diskCapacityToBytes = (
  capacityValue: number,
  capacityUnit: TDiskViewModel['capacityUnit'],
): number =>
  capacityUnit === 'tb' ? capacityValue * 1e12 : capacityValue * 1e9;

export const mapDisksToViewModel = (
  disks: TDisk[] | TInstanceDisk[],
): TDiskViewModel[] => {
  if (disks.length === 0) {
    return [
      {
        id: 'no-disk',
        display: '-',
        number: 0,
        capacityValue: 0,
        capacityUnit: 'gb',
        interface: null,
      },
    ];
  }

  return (disks as TDiskLike[]).map((disk, index) => {
    const { value, unit } = disk.capacity;
    const isTb = unit.toUpperCase() === 'GB' && value >= GB_TO_TB_THRESHOLD;
    const capacityValue = isTb
      ? Number((value / GB_TO_TB_THRESHOLD).toFixed(2))
      : value;
    const capacityUnit = isTb ? 'tb' : 'gb';
    const interfaceStr = disk.interface ?? null;
    const id = `${disk.number}_${value}_${unit}_${disk.interface ??
      'no-interface'}_${index}`;
    return {
      id,
      number: disk.number,
      capacityValue,
      capacityUnit,
      interface: interfaceStr,
    };
  });
};
