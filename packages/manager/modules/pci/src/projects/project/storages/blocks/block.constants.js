export const VOLUME_MAX_SIZE = 4 * 1000; // Should be 10 * 1024 (but API is wrong;
export const VOLUME_MIN_SIZE = 10; // 10 Gio
export const VOLUME_UNLIMITED_QUOTA = -1; // Should be 10 * 1024 (but API is wrong)

export const VOLUME_ADDON_FAMILY = 'volume';
export const VOLUME_SNAPSHOT_CONSUMPTION = 'volume.snapshot.consumption';

export const VOLUME_HELP_PREFERENCE_KEY =
  'PCI_PROJECTS_STORAGES_BLOCKS_HELP_SHOW_';

export default {
  VOLUME_MAX_SIZE,
  VOLUME_MIN_SIZE,
  VOLUME_UNLIMITED_QUOTA,
  VOLUME_ADDON_FAMILY,
  VOLUME_SNAPSHOT_CONSUMPTION,
  VOLUME_HELP_PREFERENCE_KEY,
};
