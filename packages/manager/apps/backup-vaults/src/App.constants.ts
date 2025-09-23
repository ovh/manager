import type { OnboardingConfigType } from '@/types/Onboarding.type';

export const appName = 'backup-vaults';

export const AppConfig = {
  listing: {
    datagrid: {
      serviceKey: 'id',
    },
  },
  rootLabel: appName,
} as const;

const docUrl = 'https://docs.ovh.com';

export const ONBOARDING_CONFIG: OnboardingConfigType = {
  productName: 'backup-vaults',
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
};

export type ListingApi = 'v6Iceberg' | 'v6' | 'v2';
export type DashboardApi = 'v6' | 'v2';

export const APP_FEATURES = {
  listingApi: 'v2' as ListingApi,
  dashboardApi: 'v2' as DashboardApi,
  listingEndpoint: '/backup/tenant/vault',
  dashboardEndpoint: '/backup/tenant/vault',
  routeFlavor: 'generic' as const,
  basePrefix: 'backup',
  serviceParam: 'id',
  platformParam: 'id',
  appSlug: 'vaults',
  tracking: {
    level2ByRegion: {
      EU: { level2: '0' },
      CA: { level2: '0' },
      US: { level2: '0' },
    } as const,
    universe: 'HostedPrivatedCloud' as const,
    subUniverse: 'Manager' as const,
    appNameForTracking: appName,
  },
} as const;
