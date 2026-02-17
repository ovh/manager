import { useBytes } from '@ovh-ux/manager-pci-common';
import {
  diskCapacityToBytes,
  TDiskViewModel,
} from '../view-models/mappers/diskMapper';

export const useFormatDiskDisplay = (disk: TDiskViewModel): string => {
  const { formatBytes } = useBytes();

  if (disk.id === 'no-disk') {
    return disk.display ?? '-';
  }

  const formatted = formatBytes(
    diskCapacityToBytes(disk.capacityValue, disk.capacityUnit),
    0,
    1000,
  );
  const suffix = disk.interface ? ` ${disk.interface}` : '';
  return `${disk.number}x ${formatted}${suffix}`;
};
