export const RCLONE_GUIDE: Record<string, string> = {
  FR: 'https://docs.ovh.com/fr/storage/sync-rclone-object-storage/',
  PL: 'https://docs.ovh.com/pl/storage/sync-rclone-object-storage/',
  GB: 'https://docs.ovh.com/gb/en/storage/sync-rclone-object-storage/',
  DE: 'https://docs.ovh.com/de/storage/sync-rclone-object-storage/',
  FI: 'https://docs.ovh.com/fi/storage/sync-rclone-object-storage/',
  IE: 'https://docs.ovh.com/ie/en/storage/sync-rclone-object-storage/',
  CA: 'https://docs.ovh.com/ca/en/storage/sync-rclone-object-storage/',
  ES: 'https://docs.ovh.com/es/storage/sync-rclone-object-storage/',
  IT: 'https://docs.ovh.com/it/storage/sync-rclone-object-storage/',
  PT: 'https://docs.ovh.com/pt/storage/sync-rclone-object-storage/',
  US:
    'https://support.us.ovhcloud.com/hc/en-us/articles/4605024491667-How-to-Back-Up-Your-Files-to-S3-Object-Storage-with-Rclone',
  DEFAULT: 'https://docs.ovh.com/gb/en/storage/sync-rclone-object-storage/',
};

export const DOWNLOAD_RCLONE_FILENAME = 'rclone.conf';
export const DOWNLOAD_RCLONE_FILETYPE = 'text/plain;charset=utf-8';

export const REGION_CAPACITY = 'storage';
export const S3_REGION_CAPACITY = [
  'storage-s3-high-perf',
  'storage-s3-standard',
];

export const DOWNLOAD_FILETYPE: Record<string, string> = {
  SWIFT: 'Swift',
  S3: 'S3 Compatible',
};
export const RCLONE_SERVICE_TYPE: Record<string, string> = {
  SWIFT: 'storage',
  S3: 'storage-s3',
};
