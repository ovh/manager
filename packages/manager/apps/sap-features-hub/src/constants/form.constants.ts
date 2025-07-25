export const BACKUP_KEY_LENGTH = 32;

export const CONTAINER_ID_MIN_LENGTH = 3;
export const CONTAINER_ID_MAX_LENGTH = 63;

export const CONTAINER_ID_REGEX = /^[a-z0-9][A-Za-z0-9.-]+[a-z0-9]$/;
export const ALPHANUMERIC_REGEX = /^[a-zA-Z0-9]+$/;
export const LOGS_DATA_PLATFORM_REGEX = /^(gra|bhs)[0-9]+-[a-zA-Z0-9]+\.(gra|bhs)[0-9]+\.logs\.ovh\.com$/;
export const CERTIFICAT_REGEX = /^-----BEGIN CERTIFICATE-----.+-----END CERTIFICATE-----$/s;
export const ENDPOINT_REGEX = /^https:\/\/s3\.[a-z]+\.(io|perf)\.cloud\.ovh\.net\/?$/;

export const FORM_LABELS = {
  unknownText: '-',
  secretText: '*****',
  endpoint: 'Endpoint',
  datastore: 'Datastore',
  vcpus: 'vCPUs',
  sids: 'SAP SIDs',
  sapSid: 'SAP SID',
  sapHanaSid: 'SAP HANA SID',
  masterSapPassword: 'SAP MASTER',
  masterSapHanaPassword: 'SAP HANA MASTER',
  sidadmPassword: 'SIDadm',
  systemPassword: 'SAP HANA SYSTEM',
};
