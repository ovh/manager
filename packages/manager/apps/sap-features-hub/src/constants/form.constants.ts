export const BACKUP_KEY_LENGTH = 32;

export const CONTAINER_ID_MIN_LENGTH = 3;
export const CONTAINER_ID_MAX_LENGTH = 63;
export const LOGSTASH_CERTIFICAT_MIN_LENGTH = 2048;
export const LOGSTASH_CERTIFICAT_MAX_LENGTH = 2560;

export const CONTAINER_ID_REGEX = /^[A-Za-z0-9][A-Za-z0-9.-]+[A-Za-z0-9]$/;
export const ALPHANUMERIC_REGEX = /^[a-zA-Z0-9]+$/;
export const OVH_URL_REGEX = /\.logs\.ovh\.com$/;
export const CERTIFICAT_REGEX = /^-----BEGIN CERTIFICATE-----.+-----END CERTIFICATE-----$/;
