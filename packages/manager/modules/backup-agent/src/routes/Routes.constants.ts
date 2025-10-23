import { BACKUP_AGENT_NAMESPACES } from '@/BackupAgent.translations';

export const subRoutes = {
  services: 'services' as const,
  vaults: 'vaults' as const,
  billing: 'billing' as const,
  dashboard: 'dashboard' as const,
  delete: 'delete' as const,
} as const;

export const urlParams = {
  vaultId: ':vaultId' as const,
  tenantId: ':tenantId' as const,
} as const;

export const urls = {
  root: `/`,
  onboarding: `/onboarding`,
  dashboardVaults: `/${subRoutes.vaults}/${subRoutes.dashboard}/${urlParams.vaultId}`,
  listingTenants: `/${subRoutes.services}`,
  dashboardTenants: `/${subRoutes.services}/${subRoutes.dashboard}/${urlParams.tenantId}`,
  listingTenantDelete: `/${subRoutes.services}/${subRoutes.delete}`,
  dashboardTenantDelete: `/${subRoutes.services}/${subRoutes.dashboard}/${subRoutes.delete}`,
} as const;

export const MAIN_LAYOUT_NAV_TABS = Object.freeze([
  {
    name: 'services',
    title: `${BACKUP_AGENT_NAMESPACES.COMMON}:services`,
    to: `${urls.root}${subRoutes.services}`,
    pathMatchers: [/^\/services\/[^/]+$/],
    trackingActions: ['click::services-tile-tab'],
  },
  {
    name: 'vaults',
    title: `${BACKUP_AGENT_NAMESPACES.COMMON}:vaults`,
    to: `${urls.root}${subRoutes.vaults}`,
    pathMatchers: [/^\/vaults\/[^/]+$/],
    trackingActions: ['click::vaults-tile-tab'],
  },
  {
    name: 'billing',
    title: `${BACKUP_AGENT_NAMESPACES.COMMON}:billings`,
    to: `${urls.root}${subRoutes.billing}`,
    pathMatchers: [/^\/billing\/[^/]+$/],
    trackingActions: ['click::billing-tile-tab'],
  },
]);
