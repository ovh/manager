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

const docUrl = 'https://docs.ovh.com';

export const ONBOARDING_CONFIG: OnboardingConfigType = {
  productName: 'bmc-nasha',
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
  listingApi: 'v6' as ListingApi,
  dashboardApi: 'v6' as DashboardApi,
  listingEndpoint: '/dedicated/nasha',
  dashboardEndpoint: '/dedicated/nasha',
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
    subUniverse: 'Dedicated' as const,
    appNameForTracking: appName,
  },
} as const;
