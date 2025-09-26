import type { OnboardingConfigType } from '@/types/Onboarding.type';

export const appName = 'backup-services';
export const productName = 'OVHcloud Backup Services';

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
  productName: 'backup-services',
  productCategory: 'Public Cloud',
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
  listingEndpoint: '/domain/alldom',
  dashboardEndpoint: '/domain/alldom',
  isPci: false,
  routeFlavor: 'generic' as const,
  basePrefix: 'backup',
  serviceParam: 'id',
  platformParam: 'id',
  appSlug: 'services',
  tracking: {
    level2ByRegion: {
      EU: { level2: '120' },
      CA: { level2: '120' },
      US: { level2: '120' },
    } as const,
    universe: 'HostedPrivatedCloud' as const,
    subUniverse: 'HostedPrivatedCloud' as const,
    appNameForTracking: appName,
  },
} as const;
