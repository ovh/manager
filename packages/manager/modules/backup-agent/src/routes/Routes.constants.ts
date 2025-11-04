import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { BACKUP_AGENT_NAMESPACES } from '@/BackupAgent.translations';
import { urlToStringRegex } from '@/utils/urlToStringRegex';

export const subRoutes = {
  services: 'services' as const,
  vaults: 'vaults' as const,
  billing: 'billing' as const,
  dashboard: 'dashboard' as const,
  delete: 'delete' as const,
  agents: 'agents' as const,
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
  dashboardTenantsAgents: `/${subRoutes.services}/${subRoutes.dashboard}/${urlParams.tenantId}/${subRoutes.agents}`,
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
    title: `${BACKUP_AGENT_NAMESPACES.COMMON}:billing`,
    to: `${urls.root}${subRoutes.billing}`,
    pathMatchers: [/^\/billing\/[^/]+$/],
    trackingActions: ['click::billing-tile-tab'],
  },
]);

export const TENANT_LAYOUT_NAV_TABS = Object.freeze([
  {
    name: 'generalInformations',
    title: `${NAMESPACES.DASHBOARD}:general_information`,
    to: urls.dashboardTenants,
    pathMatchers: [],
    isDefault: true,
  },
  {
    name: 'agents',
    title: `${BACKUP_AGENT_NAMESPACES.COMMON}:agents`,
    to: urls.dashboardTenantsAgents,
    pathMatchers: [new RegExp(`^${urlToStringRegex(urls.dashboardTenantsAgents)}/.+$`)],
  },
]);
