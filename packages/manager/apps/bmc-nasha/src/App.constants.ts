export const appName = 'bmc-nasha';

export const AppConfig = {
  listing: {
    datagrid: {
      serviceKey: 'serviceName',
    },
  },
  rootLabel: appName,
} as const;

export type ListingApi = 'v6Iceberg' | 'v6' | 'v2';

export const APP_FEATURES = {
  listingApi: 'v6Iceberg' as ListingApi,
  listingEndpoint: '/dedicated/nasha/{serviceName}',
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
    universe: 'Baremetal' as const,
    subUniverse: 'Dedicated' as const,
    appNameForTracking: appName,
  },
} as const;
