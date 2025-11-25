import type { OnboardingConfigType } from '@/types/Onboarding.type';

export const appName = 'bmc-nasha';

export const AppConfig = {
  listing: {
    datagrid: {
      serviceKey: 'serviceName',
    },
  },
  rootLabel: appName,
} as const;

// Guide links for onboarding (migrated from nasha module)
const GETTING_STARTED_FR = 'https://docs.ovh.com/fr/storage/nas/decouverte/';
const GETTING_STARTED_GB = 'https://docs.ovh.com/gb/en/storage/nas/get-started/';
const NFS_FR = 'https://docs.ovh.com/fr/storage/nas/nas-nfs/';
const NFS_GB = 'https://docs.ovh.com/gb/en/storage/nas-nfs/';
const CIFS_FR = 'https://docs.ovh.com/fr/storage/nas/nas-cifs/';
const CIFS_GB = 'https://docs.ovh.com/gb/en/storage/nas/nas-cifs/';

export const ONBOARDING_GUIDES = {
  'getting-started': {
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
  nfs: {
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
  cifs: {
    FR: CIFS_FR,
    DE: 'https://docs.ovh.com/de/storage/nas/nas-cifs/',
    CA: 'https://docs.ovh.com/ca/en/storage/nas-cifs/',
    GB: CIFS_GB,
    IE: 'https://docs.ovh.com/ie/en/storage/nas-cifs/',
    US: 'https://docs.ovh.com/us/en/storage/nas-cifs/',
    ES: 'https://docs.ovh.com/es/storage/nas-cifs/',
    WS: 'https://docs.ovh.com/us/es/storage/nas-cifs/',
    WW: 'https://docs.ovh.com/us/en/storage/nas-cifs/',
    QC: 'https://docs.ovh.com/ca/fr/storage/nas/nas-cifs/',
    IT: 'https://docs.ovh.com/it/storage/nas-cifs/',
    PL: 'https://docs.ovh.com/pl/storage/nas-cifs/',
    PT: 'https://docs.ovh.com/pt/storage/nas-cifs/',
    MA: CIFS_FR,
    SN: CIFS_FR,
    TN: CIFS_FR,
    NL: CIFS_GB,
    AU: CIFS_GB,
    SG: CIFS_GB,
    ASIA: CIFS_GB,
  },
} as const;

export const ONBOARDING_CONFIG: OnboardingConfigType = {
  productName: 'NAS-HA',
  productCategory: 'Storage',
  brand: 'OVHcloud',
  tiles: [
    { id: 1, key: 'getting-started', linkKey: 'discover' },
    { id: 2, key: 'nfs', linkKey: 'tutorial' },
    { id: 3, key: 'cifs', linkKey: 'faq' },
  ],
  links: {
    discover: GETTING_STARTED_GB, // Default fallback
    tutorial: NFS_GB, // Default fallback
    faq: CIFS_GB, // Default fallback
  },
};

export type ListingApi = 'v6Iceberg' | 'v6' | 'v2';
export type DashboardApi = 'v6' | 'v2';

export const SERVICE_TYPE = 'DEDICATED_NASHA';

export const APP_FEATURES = {
  listingApi: 'v6Iceberg' as ListingApi,
  dashboardApi: 'v6' as DashboardApi,
  listingEndpoint: '/dedicated/nasha',
  dashboardEndpoint: '/dedicated/nasha/{serviceName}',
  isPci: false,
  routeFlavor: 'generic' as const,
  basePrefix: '',
  serviceParam: 'id',
  platformParam: 'id',
  appSlug: 'bmc-nasha',
  tracking: {
    level2ByRegion: {
      EU: { level2: '0' },
      CA: { level2: '0' },
      US: { level2: '0' },
    } as const,
    universe: 'Baremetal' as const,
    subUniverse: 'storage_backup' as const,
    appNameForTracking: 'nasha' as const,
  },
} as const;
