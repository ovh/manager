import {
  COLD_ARCHIVE_STATES as STATES,
  COLD_ARCHIVE_TRACKING_PREFIX as TRACKING,
  REGION as DEFAULT_REGION,
} from '../../cold-archives.constants';

export const COLD_ARCHIVE_STATES = STATES;
export const COLD_ARCHIVE_TRACKING_PREFIX = TRACKING;
export const COLD_ARCHIVE_DEFAULT_REGION = DEFAULT_REGION;

export const RCLONE_GUIDE = {
  DEFAULT: 'https://docs.ovh.com/gb/en/storage/sync-rclone-object-storage/',
  FR: 'https://docs.ovh.com/fr/storage/sync-rclone-object-storage/',
  PL: 'https://docs.ovh.com/pl/storage/sync-rclone-object-storage/',
  GB: 'https://docs.ovh.com/gb/en/storage/sync-rclone-object-storage/',
  DE: 'https://docs.ovh.com/de/storage/sync-rclone-object-storage/',
  IT: 'https://docs.ovh.com/it/storage/sync-rclone-object-storage/',
  FI: 'https://docs.ovh.com/fi/storage/sync-rclone-object-storage/',
  IE: 'https://docs.ovh.com/ie/en/storage/sync-rclone-object-storage/',
};

export const DOWNLOAD_FILENAME = 'rclone.conf';
export const DOWNLOAD_TYPE = 'text/plain;charset=utf-8';
export const DOWNLOAD_RCLONE_FILENAME = 'rclone.conf';
export const DOWNLOAD_RCLONE_FILETYPE = 'text/plain;charset=utf-8';
export const REGION_CAPACITY = 'storage';
export const S3_REGION_CAPACITY = [
  'storage-s3-high-perf',
  'storage-s3-standard',
];
export const DOWNLOAD_FILETYPE = {
  SWIFT: 'Swift',
  S3: 'S3',
};
export const RCLONE_SERVICE_TYPE = {
  SWIFT: 'storage',
  S3: 'storage-s3',
};

export default {
  DOWNLOAD_FILENAME,
  DOWNLOAD_TYPE,
  RCLONE_GUIDE,
  DOWNLOAD_RCLONE_FILENAME,
  DOWNLOAD_RCLONE_FILETYPE,
  REGION_CAPACITY,
  S3_REGION_CAPACITY,
  DOWNLOAD_FILETYPE,
  RCLONE_SERVICE_TYPE,
};
