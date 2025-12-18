// API Constants
export const NASHA_ACL_TYPE_ENUM = 'dedicated.storage.AclTypeEnum';
export const NASHA_ALERT_ID = 'nasha_alert';
export const NASHA_BASE_API_URL = '/dedicated/nasha';
export const NASHA_PROTOCOL_ENUM = 'dedicated.storage.ProtocolEnum';
export const NASHA_RECORD_SIZE_ENUM = 'dedicated.storage.RecordSizeEnum';
export const NASHA_SNAPSHOT_ENUM = 'dedicated.storage.SnapshotEnum';
export const NASHA_SYNC_ENUM = 'dedicated.storage.SyncEnum';
export const NASHA_TITLE = 'NAS-HA';
export const NASHA_USE_SIZE_NAME = 'size';

export const NASHA_DEFAULT_ZFS_OPTIONS = {
  atime: 'off',
  recordsize: '131072',
  sync: 'standard',
};

// Tracking Constants
export const PREFIX_TRACKING_NASHA = 'nasha';
export const PREFIX_TRACKING_ONBOARDING = 'onboarding';
export const PREFIX_TRACKING_ONBOARDING_GUIDES = 'onboarding::documentation';
export const PREFIX_TRACKING_ORDER = 'order';
export const PREFIX_TRACKING_DASHBOARD = 'dashboard';
export const PREFIX_TRACKING_DASHBOARD_PARTITIONS = `${PREFIX_TRACKING_DASHBOARD}::nasha-partitions`;
export const PREFIX_TRACKING_EDIT_NAME = 'dashboard::edit-name';

// Partition Constants
export const DESCRIPTION_MAX = 50;
export const NAME_PATTERN = /^[a-z0-9_-]+$/i;
export const SIZE_MIN = 10;

export const PREFIX_TRACKING_DASHBOARD_NASHA_PARTITION =
  'dashboard::nasha-partitions::';
export const PREFIX_TRACKING_PARTITION_DASHBOARD = 'partition::dashboard::';
export const PREFIX_TRACKING_DASHBOARD_PARTITION_CREATE = `${PREFIX_TRACKING_DASHBOARD_NASHA_PARTITION}create`;
export const PREFIX_TRACKING_DASHBOARD_PARTITION_DELETE = `${PREFIX_TRACKING_DASHBOARD_NASHA_PARTITION}delete`;
export const PREFIX_TRACKING_DASHBOARD_PARTITION_UPDATE_SIZE = `${PREFIX_TRACKING_PARTITION_DASHBOARD}edit-size`;
export const PREFIX_TRACKING_DASHBOARD_PARTITION_UPDATE_DESCRIPTION = `${PREFIX_TRACKING_PARTITION_DASHBOARD}edit-description`;
export const PREFIX_TRACKING_DASHBOARD_PARTITION_ZFS_OPTION = `${PREFIX_TRACKING_DASHBOARD_NASHA_PARTITION}zfs-options`;
export const PREFIX_TRACKING_PARTITION_ACL = 'partition::acl';
export const PREFIX_TRACKING_SNAPSHOT_POLICY = 'partition::snapshot-policy';

// ZFS Options Templates
export const ZFS_OPTIONS_TEMPLATES = {
  FILE_SYSTEM: 'File Systems (big files)',
  VIRTUAL_MACHINES: 'Virtual machines',
  DATABASES: 'Databases',
  DEFAULT: 'Default',
  CUSTOM: 'Custom',
} as const;

// Snapshot Constants
export const CUSTOM_SNAPSHOT_NAME_PATTERN = /^[a-zA-Z0-9.:-]+$/;
export const CUSTOM_SNAPSHOT_NAME_PREFIX = 'snap';
export const CUSTOM_SNAPSHOT_NAME_SEPARATOR = '-';
export const MAX_CUSTOM_SNAPSHOT = 10;

// Access Constants
export const NFS_PROTOCOL = 'NFS';
export const READONLY_TYPE = 'readonly';

// Service Type
export const SERVICE_TYPE = 'DEDICATED_NASHA';

// Billing Tracking
const COMMIT_RECOMMIT_IMPRESSION_TRACKING_DATA = {
  campaignId: '[commit-recommit]',
  creation: '[batch2]',
  format: '[link]',
  generalPlacement: '[nasha]',
  detailedPlacement: '[commitment]',
};

export const COMMIT_IMPRESSION_TRACKING_DATA = {
  ...COMMIT_RECOMMIT_IMPRESSION_TRACKING_DATA,
  variant: '[commit]',
};

export const RECOMMIT_IMPRESSION_TRACKING_DATA = {
  ...COMMIT_RECOMMIT_IMPRESSION_TRACKING_DATA,
  variant: '[recommit]',
};

// Guides URLs
export const GUIDES_URL: Record<string, string> = {
  DEFAULT:
    'https://help.ovhcloud.com/csm/en-gb-public-cloud-storage-nas-get-started?id=kb_article_view&sysparm_article=KB0046698',
  DE:
    'https://help.ovhcloud.com/csm/de-public-cloud-storage-nas-get-started?id=kb_article_view&sysparm_article=KB0046689',
  ES:
    'https://help.ovhcloud.com/csm/es-es-public-cloud-storage-nas-get-started?id=kb_article_view&sysparm_article=KB0046695',
  IT:
    'https://help.ovhcloud.com/csm/it-public-cloud-storage-nas-get-started?id=kb_article_view&sysparm_article=KB0046703',
  PL:
    'https://help.ovhcloud.com/csm/pl-public-cloud-storage-nas-get-started?id=kb_article_view&sysparm_article=KB0046701',
  PT:
    'https://help.ovhcloud.com/csm/pt-public-cloud-storage-nas-get-started?id=kb_article_view&sysparm_article=KB0046699',
  GB:
    'https://help.ovhcloud.com/csm/en-gb-public-cloud-storage-nas-get-started?id=kb_article_view&sysparm_article=KB0046698',
  CA:
    'https://help.ovhcloud.com/csm/en-ca-public-cloud-storage-nas-get-started?id=kb_article_view&sysparm_article=KB0046694',
  QC:
    'https://help.ovhcloud.com/csm/fr-ca-public-cloud-storage-nas-get-started?id=kb_article_view&sysparm_article=KB0046700',
  FR:
    'https://help.ovhcloud.com/csm/fr-public-cloud-storage-nas-get-started?id=kb_article_view&sysparm_article=KB0046704',
  IN:
    'https://help.ovhcloud.com/csm/asia-public-cloud-storage-nas-get-started?id=kb_article_view&sysparm_article=KB0033989',
  MA:
    'https://help.ovhcloud.com/csm/fr-public-cloud-storage-nas-get-started?id=kb_article_view&sysparm_article=KB0046704',
  TN:
    'https://help.ovhcloud.com/csm/fr-public-cloud-storage-nas-get-started?id=kb_article_view&sysparm_article=KB0046704',
  SN:
    'https://help.ovhcloud.com/csm/fr-public-cloud-storage-nas-get-started?id=kb_article_view&sysparm_article=KB0046704',
};

// EOL Banner Links
export const EOL_LV1_LV2_SERVICES_LINK_INFO: Record<string, string> = {
  DEFAULT: 'https://docs.ovh.com/gb/en/storage/file-storage/nas/migration/',
  ASIA: 'https://docs.ovh.com/asia/en/storage/file-storage/nas/migration/',
  AU: 'https://docs.ovh.com/au/en/storage/file-storage/nas/migration/',
  CA: 'https://docs.ovh.com/ca/en/storage/file-storage/nas/migration/',
  DE: 'https://docs.ovh.com/de/storage/file-storage/nas/migration/',
  ES: 'https://docs.ovh.com/es/storage/file-storage/nas/migration/',
  FR: 'https://docs.ovh.com/fr/storage/file-storage/nas/migration/',
  GB: 'https://docs.ovh.com/gb/en/storage/file-storage/nas/migration/',
  IE: 'https://docs.ovh.com/ie/en/storage/file-storage/nas/migration/',
  IT: 'https://docs.ovh.com/it/storage/file-storage/nas/migration/',
  PL: 'https://docs.ovh.com/it/storage/file-storage/nas/migration/',
  PT: 'https://docs.ovh.com/pt/storage/file-storage/nas/migration/',
  QC: 'https://docs.ovh.com/ca/fr/storage/file-storage/nas/migration/',
  US: 'https://docs.ovh.com/us/en/storage/file-storage/nas/migration/',
  WS: 'https://docs.ovh.com/es/storage/file-storage/nas/migration/',
};

// Onboarding Guides
const GETTING_STARTED_FR = 'https://docs.ovh.com/fr/storage/nas/decouverte/';
const GETTING_STARTED_GB = 'https://docs.ovh.com/gb/en/storage/nas/get-started/';
const NFS_FR = 'https://docs.ovh.com/fr/storage/nas/nas-nfs/';
const NFS_GB = 'https://docs.ovh.com/gb/en/storage/nas-nfs/';
const CIFS_FR = 'https://docs.ovh.com/fr/storage/nas/nas-cifs/';
const CIFS_GB = 'https://docs.ovh.com/gb/en/storage/nas/nas-cifs/';

export interface Guide {
  id: string;
  link: Record<string, string>;
  hitSuffix: string;
}

export const GUIDES: Guide[] = [
  {
    id: 'getting-started',
    link: {
      FR: GETTING_STARTED_FR,
      DE: 'https://docs.ovh.com/de/storage/nas/erste-schritte/',
      CA: 'https://docs.ovh.com/ca/en/storage/nas/get-started/',
      GB: GETTING_STARTED_GB,
      IE: 'https://docs.ovh.com/ie/en/storage/nas/get-started/',
      US: 'https://docs.ovh.com/us/en/storage/nas/get-started/',
      ES: 'https://docs.ovh.com/es/storage/nas/primeros-pasos/',
      WS: 'https://docs.ovh.com/us/es/storage/nas/primeros-pasos/',
      WW: 'https://docs.ovh.com/us/en/storage/nas/get-started/',
      QC: 'https://docs.ovh.com/ca/fr/storage/nas/decouverte/',
      IT: 'https://docs.ovh.com/it/storage/nas/iniziare/',
      PL: 'https://docs.ovh.com/pl/storage/nas/pierwsze-kroki/',
      PT: 'https://docs.ovh.com/pt/storage/nas/primeiros-passos/',
      MA: GETTING_STARTED_FR,
      SN: GETTING_STARTED_FR,
      TN: GETTING_STARTED_FR,
      NL: GETTING_STARTED_GB,
      AU: GETTING_STARTED_GB,
      SG: GETTING_STARTED_GB,
      ASIA: GETTING_STARTED_GB,
    },
    hitSuffix: 'get-started',
  },
  {
    id: 'nfs',
    link: {
      FR: NFS_FR,
      DE: 'https://docs.ovh.com/de/storage/nas-nfs/',
      CA: 'https://docs.ovh.com/ca/en/storage/nas-nfs/',
      GB: NFS_GB,
      IE: 'https://docs.ovh.com/ie/en/storage/nas-nfs/',
      US: 'https://docs.ovh.com/us/en/storage/nas-nfs/',
      ES: 'https://docs.ovh.com/es/storage/nas-nfs/',
      WS: 'https://docs.ovh.com/us/es/storage/nas-nfs/',
      WW: 'https://docs.ovh.com/us/en/storage/nas-nfs/',
      QC: 'https://docs.ovh.com/ca/fr/storage/nas/nas-nfs/',
      IT: 'https://docs.ovh.com/it/storage/nas-nfs/',
      PL: 'https://docs.ovh.com/pl/storage/nas-nfs/',
      PT: 'https://docs.ovh.com/pt/storage/nas-nfs/',
      MA: NFS_FR,
      SN: NFS_FR,
      TN: NFS_FR,
      NL: NFS_GB,
      AU: NFS_GB,
      SG: NFS_GB,
      ASIA: NFS_GB,
    },
    hitSuffix: 'faq-nas',
  },
  {
    id: 'cifs',
    link: {
      FR: CIFS_FR,
      DE: 'https://docs.ovh.com/de/storage/nas/nas-cifs/',
      CA: 'https://docs.ovh.com/ca/en/storage/nas/nas-cifs/',
      GB: CIFS_GB,
      IE: 'https://docs.ovh.com/ie/en/storage/nas/nas-cifs/',
      US: 'https://docs.ovh.com/us/en/storage/nas/nas-cifs/',
      ES: 'https://docs.ovh.com/es/storage/nas/nas-cifs/',
      WS: 'https://docs.ovh.com/us/es/storage/nas/nas-cifs/',
      WW: 'https://docs.ovh.com/us/en/storage/nas/nas-cifs/',
      QC: 'https://docs.ovh.com/ca/fr/storage/nas/nas-cifs/',
      IT: 'https://docs.ovh.com/it/storage/nas/nas-cifs/',
      PL: 'https://docs.ovh.com/pl/storage/nas/nas-cifs/',
      PT: 'https://docs.ovh.com/pt/storage/nas/nas-cifs/',
      MA: CIFS_FR,
      SN: CIFS_FR,
      TN: CIFS_FR,
      NL: CIFS_GB,
      AU: CIFS_GB,
      SG: CIFS_GB,
      ASIA: CIFS_GB,
    },
    hitSuffix: 'nas-cifs',
  },
];

