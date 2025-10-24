import type { OnboardingConfigType } from '@/types/Onboarding.type';

export const appName = 'bmc-nasha';

export const AppConfig = {
  listing: {
    datagrid: {
      serviceKey: 'nasha',
    },
  },
  rootLabel: appName,
} as const;

const docUrl = 'https://docs.ovh.com';

export const ONBOARDING_CONFIG: OnboardingConfigType = {
  productName: 'NAS-HA',
  productCategory: 'Storage',
  brand: 'OVHcloud',
  tiles: [
    { id: 1, key: 'getting-started', linkKey: 'gettingStarted' },
    { id: 2, key: 'nfs', linkKey: 'nfs' },
    { id: 3, key: 'cifs', linkKey: 'cifs' },
  ],
  links: {
    gettingStarted: 'https://docs.ovh.com/gb/en/storage/nas/get-started/',
    nfs: 'https://docs.ovh.com/gb/en/storage/nas-nfs/',
    cifs: 'https://docs.ovh.com/gb/en/storage/nas/nas-cifs/',
  },
};

export type ListingApi = 'v6Iceberg' | 'v6' | 'v2';
export type DashboardApi = 'v6' | 'v2';

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
      EU: { level2: '57' },
      CA: { level2: '57' },
      US: { level2: '57' },
    } as const,
    universe: 'Dedicated' as const,
    subUniverse: 'Dedicated' as const,
    appNameForTracking: appName,
  },
} as const;
