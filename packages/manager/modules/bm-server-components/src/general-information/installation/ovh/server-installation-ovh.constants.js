export const MOUNT_POINTS = 'defghijklmnopqrstuvwxyza';
export const MAX_MOUNT_POINTS = 24;

export const TEMPLATE_OS_HARDWARE_RAID_ENUM = {
  raid0: 'raid0',
  raid1: 'raid1',
  raid5: 'raid5',
  raid6: 'raid6',
  raid7: 'raid7',
  raid10: 'raid10',
  raid50: 'raid50',
  raid60: 'raid60',
};

export const TEMPLATE_OS_SOFTWARE_RAID_LIST = {
  1: ['_0'],
  2: ['_0', '_1'],
  3: ['_0', '_1', '_5'],
  4: ['_0', '_1', '_5', '_10'],
  5: ['_0', '_1', '_5', '_6', '_10'],
  6: ['_0', '_1', '_5', '_6', '_10'],
  7: ['_0', '_1', '_5', '_6', '_7', '_10'],
};

export const PARTITION_TYPES = ['LOGICAL', 'LV', 'PRIMARY'];

export default {
  MOUNT_POINTS,
  MAX_MOUNT_POINTS,
  TEMPLATE_OS_HARDWARE_RAID_ENUM,
  TEMPLATE_OS_SOFTWARE_RAID_LIST,
  PARTITION_TYPES,
};
