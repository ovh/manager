export const RTM_GUIDE_URLS = {
  FR: 'https://docs.ovh.com/fr/dedicated/installer-rtm/',
  GB: 'https://docs.ovh.com/gb/en/dedicated/install-rtm/',
  DE: 'https://docs.ovh.com/de/dedicated/rtm-installieren/',
  ES: 'https://docs.ovh.com/es/dedicated/instalar-rtm/',
  IT: 'https://docs.ovh.com/it/dedicated/installare-rtm/',
  PL: 'https://docs.ovh.com/pl/dedicated/instalacja-rtm/',
  PT: 'https://docs.ovh.com/pt/dedicated/instalar-rtm/',
};

export const RTM_INSTALL_FEATURE = 'dedicated-server:install:ovh:installRTM';

export const CONSTANTS = {
  forbiddenMountPoint: [
    '/etc',
    '/bin',
    '/sbin',
    '/dev',
    '/lib',
    '/lib64',
    '/lost+found',
    '/proc',
    '/sys',
  ],

  warningRaid0: '_0',
  warningRaid1: '_1',
  warningLV: 'LV',
  warningLogical: 'LOGICAL',
  warningPrimary: 'PRIMARY',
  warningSwap: 'SWAP',
  warningReiserfs: 'REISERFS',
  warningWindows: 'WINDOWS',
  warningBoot: '/boot',
  warningRoot: '/',
  warningCwin: 'c:',
  warningNTFS: 'NTFS',
  warningEXT4: 'EXT_4',
  warningLINUX: 'LINUX',
  warningZFS: 'ZFS',

  swapLabel: 'swap',

  maxSizeSwap: 30000,
  maxSizePartition: 2000000,
  minSizePartition: 10,
  minSizeWindows: 32768,
  minSizeReiserfs: 32,
  minSizeBoot: 50,
};

export const TEMPLATE_OS_HARDWARE_RAID_ENUM = {
  raid0: 'raid0',
  raid1: 'raid1',
  raid5: 'raid5',
  raid6: 'raid6',
  raid10: 'raid10',
  raid50: 'raid50',
  raid60: 'raid60',
};

export default {
  RTM_GUIDE_URLS,
  RTM_INSTALL_FEATURE,
  CONSTANTS,
  TEMPLATE_OS_HARDWARE_RAID_ENUM,
};
