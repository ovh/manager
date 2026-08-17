export const appName = 'hpc-backup-licenses';
export const productName = 'OVHcloud Backup Licenses';

export const AppConfig = {
  listing: {
    datagrid: {
      serviceKey: 'name',
    },
  },
  rootLabel: appName,
} as const;

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
    universe: 'HostedPrivatedCloud' as const,
    subUniverse: 'HostedPrivatedCloud' as const,
    appNameForTracking: appName,
  },
} as const;
