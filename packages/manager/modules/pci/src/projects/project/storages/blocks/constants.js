export const VOLUME_MAX_SIZE = 4 * 1000; // Should be 10 * 1024 (but API is wrong;
export const VOLUME_MIN_SIZE = 10; // 10 Gio
export const VOLUME_UNLIMITED_QUOTA = -1; // Should be 10 * 1024 (but API is wrong)
export const VOLUME_TYPES = [
  'classic',
  'high-speed',
];

export default {
  VOLUME_MAX_SIZE,
  VOLUME_MIN_SIZE,
  VOLUME_UNLIMITED_QUOTA,
  VOLUME_TYPES,
};
