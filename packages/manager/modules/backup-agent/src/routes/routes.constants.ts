import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { BACKUP_AGENT_NAMESPACES } from '@/BackupAgent.translations';
import { LABELS } from '@/module.constants';
import { urlToStringRegex } from '@/utils/urlToStringRegex';

export const subRoutes = {
  service: 'service',
  vaults: 'vaults',
  billing: 'billing',
  dashboard: 'dashboard',
  delete: 'delete',
  agents: 'agents',
  buckets: 'buckets',
  add: 'add',
  configure: 'configure',
  download: 'download',
  resetPassword: 'reset-password',
} as const;

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
  dashboardVaults: `/${subRoutes.vaults}/${urlParams.vaultId}`,
  dashboardVaultsDelete: `/${subRoutes.vaults}/${urlParams.vaultId}/${subRoutes.delete}`,
  listingVaultBuckets: `/${subRoutes.vaults}/${urlParams.vaultId}/${subRoutes.buckets}`,
  dashboardTenant: `/${subRoutes.service}`,
  dashboardAgents: `/${subRoutes.agents}`,
  dashboardTenantResetPassword: `/${subRoutes.service}/${subRoutes.resetPassword}`,
  addAgentConfiguration: `/${subRoutes.agents}/${subRoutes.add}`,
  dashboardTenantAgentDelete: `/${subRoutes.agents}/${subRoutes.delete}/${urlParams.agentId}`,
  editAgentConfiguration: `/${subRoutes.agents}/${subRoutes.configure}/${urlParams.agentId}`,
  downloadAgentBackup: `/${subRoutes.agents}/${subRoutes.download}`,
  listingTenantDelete: `/${subRoutes.service}/${subRoutes.delete}`,
  dashboardTenantDelete: `/${subRoutes.service}/${subRoutes.delete}`,
  listingBilling: `/${subRoutes.billing}`,
} as const;

export const MAIN_LAYOUT_NAV_TABS = Object.freeze([
  {
    name: 'service',
    title: `${NAMESPACES.DASHBOARD}:general_information`,
    to: `${urls.root}${subRoutes.service}`,
    pathMatchers: [/^\/service\/[^/]+$/],
    trackingActions: ['click::service-tile-tab'],
  },
  {
    name: 'agents',
    title: `${BACKUP_AGENT_NAMESPACES.COMMON}:agents`,
    to: `${urls.root}${subRoutes.agents}`,
    pathMatchers: [/^\/agents\/[^/]+$/],
    trackingActions: ['click::agents-tile-tab'],
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
