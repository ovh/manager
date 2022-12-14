import {
  COLD_ARCHIVE_STATES as STATES,
  COLD_ARCHIVE_TRACKING_PREFIX as TRACKING,
  REGION as DEFAULT_REGION,
} from '../../cold-archives.constants';

export const COLD_ARCHIVE_STATES = STATES;
export const COLD_ARCHIVE_TRACKING_PREFIX = TRACKING;
export const COLD_ARCHIVE_DEFAULT_REGION = DEFAULT_REGION;

export const RCLONE_GUIDE = {
  DEFAULT: 'https://docs.ovh.com/en/storage/object-storage/s3/rclone/',
  DE: 'https://docs.ovh.com/de/storage/object-storage/s3/rclone/',
  ES: 'https://docs.ovh.com/es/storage/object-storage/s3/rclone/',
  FR: 'https://docs.ovh.com/fr/storage/object-storage/s3/rclone/',
  CA: 'https://docs.ovh.com/ca/storage/object-storage/s3/rclone/',
  EN: 'https://docs.ovh.com/en/storage/object-storage/s3/rclone/',
  IT: 'https://docs.ovh.com/it/storage/object-storage/s3/rclone/',
  PL: 'https://docs.ovh.com/pl/storage/object-storage/s3/rclone/',
  PT: 'https://docs.ovh.com/pt/storage/object-storage/s3/rclone/',
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
