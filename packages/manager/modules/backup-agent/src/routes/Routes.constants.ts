import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { BACKUP_AGENT_NAMESPACES } from '@/BackupAgent.translations';
import { urlToStringRegex } from '@/utils/urlToStringRegex';

export const subRoutes = Object.freeze({
  services: 'services',
  vaults: 'vaults',
  billing: 'billing',
  dashboard: 'dashboard',
  delete: 'delete',
  agents: 'agents',
  buckets: 'buckets',
  add: 'add',
  configure: 'configure',
});

export const urlParams = {
  vaultId: ':vaultId' as const,
  tenantId: ':tenantId' as const,
  agentId: ':agentId' as const,
} as const;

export const urls = {
  root: `/`,
  onboarding: `/onboarding`,
  listingVaults: `/${subRoutes.vaults}`,
  dashboardVaults: `/${subRoutes.vaults}/${subRoutes.dashboard}/${urlParams.vaultId}`,
  listingVaultBuckets: `/${subRoutes.vaults}/${subRoutes.dashboard}/${urlParams.vaultId}/${subRoutes.buckets}`,
  listingTenants: `/${subRoutes.services}`,
  dashboardTenants: `/${subRoutes.services}/${subRoutes.dashboard}/${urlParams.tenantId}`,
  dashboardTenantAgents: `/${subRoutes.services}/${subRoutes.dashboard}/${urlParams.tenantId}/${subRoutes.agents}`,
  addAgentConfiguration: `/${subRoutes.services}/${subRoutes.dashboard}/${urlParams.tenantId}/${subRoutes.agents}/${subRoutes.add}`,
  editAgentConfiguration: `/${subRoutes.services}/${subRoutes.dashboard}/${urlParams.tenantId}/${subRoutes.agents}/${subRoutes.configure}/${urlParams.agentId}`,
  listingTenantDelete: `/${subRoutes.services}/${subRoutes.delete}`,
  dashboardTenantDelete: `/${subRoutes.services}/${subRoutes.dashboard}/${subRoutes.delete}`,
  listingBilling: `/${subRoutes.billing}`,
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
    to: urls.dashboardTenantAgents,
    pathMatchers: [new RegExp(`^${urlToStringRegex(urls.dashboardTenantAgents)}/.+$`)],
  },
]);

export const VAULT_LAYOUT_NAV_TABS = Object.freeze([
  {
    name: 'generalInformations',
    title: `${NAMESPACES.DASHBOARD}:general_information`,
    to: urls.dashboardVaults,
    pathMatchers: [],
    isDefault: true,
  },
  {
    name: 'buckets',
    title: `${BACKUP_AGENT_NAMESPACES.COMMON}:buckets`,
    to: urls.listingVaultBuckets,
    pathMatchers: [new RegExp(`^${urlToStringRegex(urls.listingVaultBuckets)}/.+$`)],
  },
]);
