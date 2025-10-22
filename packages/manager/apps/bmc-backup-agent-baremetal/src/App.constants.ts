import { OnboardingConfigType } from '@/types/Onboarding.type';

import ovhcloudBackupImg from './assets/OVHcloudBackup.svg?url';

export const appName = 'bmc-backup-agent-baremetal';
export const productName = 'OVHcloud Backup Agent for Bare Metal';

export const AppConfig = {
  listing: {
    datagrid: {
      serviceKey: 'name',
    },
  },
  rootLabel: appName,
} as const;

const docUrl = 'https://docs.ovh.com';

export const ONBOARDING_CONFIG: OnboardingConfigType = {
  productName,
  productCategory: 'Backup',
  brand: 'OVHcloud',
  tiles: [
    { id: 1, key: 'guide1', linkKey: 'discover' },
    { id: 2, key: 'guide2', linkKey: 'tutorial' },
    { id: 3, key: 'guide3', linkKey: 'faq' },
  ],
  links: {
    discover: docUrl,
    tutorial: docUrl,
    faq: docUrl,
  },
  title: productName,
  heroImage: { src: ovhcloudBackupImg },
};

export type ListingApi = 'v6Iceberg' | 'v6' | 'v2';
export type DashboardApi = 'v6' | 'v2';

export const APP_FEATURES = {
  listingApi: 'v2' as ListingApi,
  dashboardApi: 'v2' as DashboardApi,
  dashboardEndpoint: '',
  routeFlavor: 'generic' as const,
  basePrefix: '',
  serviceParam: 'id',
  platformParam: 'id',
  appSlug: '',
  tracking: {
    level2ByRegion: {
      EU: { level2: '120' },
      CA: { level2: '120' },
      US: { level2: '120' },
    } as const,
    universe: '' as const,
    subUniverse: '' as const,
    appNameForTracking: appName,
  },
} as const;
