export const SAP_SOURCE_PATTERNS = {
  bucket: /^[a-z0-9]([A-Za-z0-9\-.]{1,61})[a-z0-9]$/.source,
  key: /^[A-Za-z0-9]{32}$/.source,
} as const;

export const SOURCE_BUCKET_MIN_LENGTH = 3;
export const SOURCE_BUCKET_MAX_LENGTH = 63;
export const SOURCE_KEY_LENGTH = 32;
