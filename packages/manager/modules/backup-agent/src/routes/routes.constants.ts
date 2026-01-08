import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { BACKUP_AGENT_NAMESPACES } from '@/BackupAgent.translations';
import { LABELS } from '@/module.constants';
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
  download: 'download',
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
  listingVaultsDelete: `/${subRoutes.vaults}/${subRoutes.delete}`,
  dashboardVaults: `/${subRoutes.vaults}/${subRoutes.dashboard}/${urlParams.vaultId}`,
  dashboardVaultsDelete: `/${subRoutes.vaults}/${subRoutes.dashboard}/${urlParams.vaultId}/${subRoutes.delete}`,
  listingVaultBuckets: `/${subRoutes.vaults}/${subRoutes.dashboard}/${urlParams.vaultId}/${subRoutes.buckets}`,
  listingTenants: `/${subRoutes.services}`,
  dashboardTenants: `/${subRoutes.services}/${subRoutes.dashboard}/${urlParams.tenantId}`,
  dashboardTenantAgents: `/${subRoutes.services}/${subRoutes.dashboard}/${urlParams.tenantId}/${subRoutes.agents}`,
  addAgentConfiguration: `/${subRoutes.services}/${subRoutes.dashboard}/${urlParams.tenantId}/${subRoutes.agents}/${subRoutes.add}`,
  dashboardTenantAgentDelete: `/${subRoutes.services}/${subRoutes.dashboard}/${urlParams.tenantId}/${subRoutes.agents}/${subRoutes.delete}/${urlParams.agentId}`,
  editAgentConfiguration: `/${subRoutes.services}/${subRoutes.dashboard}/${urlParams.tenantId}/${subRoutes.agents}/${subRoutes.configure}/${urlParams.agentId}`,
  downloadAgentBackup: `/${subRoutes.services}/${subRoutes.dashboard}/${urlParams.tenantId}/${subRoutes.agents}/${subRoutes.download}`,
  listingTenantDelete: `/${subRoutes.services}/${subRoutes.delete}`,
  dashboardTenantDelete: `/${subRoutes.services}/${subRoutes.dashboard}/${urlParams.tenantId}/${subRoutes.delete}`,
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
    title: LABELS.VAULTS,
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
