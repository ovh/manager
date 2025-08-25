import type { OnboardingConfigType } from '@/types/Onboarding.type';

export const appName = '{{appNameKebab}}';

export const AppConfig = {
  listing: {
    datagrid: {
      serviceKey: '{{serviceKey}}',
    },
  },
  rootLabel: appName,
} as const;

const docUrl = 'https://docs.ovh.com';

export const ONBOARDING_CONFIG: OnboardingConfigType = {
  productName: '{{appNameKebab}}',
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
  listingApi: '{{listingApi}}' as ListingApi,
  dashboardApi: '{{dashboardApi}}' as DashboardApi,
  listingEndpoint: '{{listingEndpoint}}',
  dashboardEndpoint: '{{dashboardEndpoint}}',
  isPci: '{{isPci}}',
  routeFlavor: '{{routeFlavor}}' as const,
  basePrefix: '{{basePrefix}}',
  serviceParam: 'id',
  platformParam: 'id',
  appSlug: '{{appSlug}}',
  tracking: {
    level2ByRegion: {
      EU: { level2: '{{trackingLevel2}}' },
      CA: { level2: '{{trackingLevel2}}' },
      US: { level2: '{{trackingLevel2}}' },
    } as const,
    universe: '{{trackingUniverse}}' as const,
    subUniverse: '{{trackingSubUniverse}}' as const,
    appNameForTracking: appName,
  },
} as const;
