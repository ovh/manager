import { BACKUP_AGENT_NAMESPACES } from '@/BackupAgent.translations';

export const subRoutes = {
  services: 'services' as const,
  vaults: 'vaults' as const,
  billing: 'billing' as const,
  dashboard: 'dashboard' as const,
} as const;

export const urlParams = {
  vaultId: ':vaultId' as const,
} as const;

export const urls = {
  root: ``,
  dashboard: `${subRoutes.dashboard}/${urlParams.vaultId}`,
  onboarding: `onboarding`,
} as const;

export const MAIN_LAYOUT_NAV_TABS = Object.freeze([
  {
    name: 'services',
    title: `${BACKUP_AGENT_NAMESPACES.COMMON}:services`,
    to: subRoutes.services,
    pathMatchers: [/^\/services\/[^/]+$/],
    trackingActions: ['click::services-tile-tab'],
  },
  {
    name: 'vaults',
    title: `${BACKUP_AGENT_NAMESPACES.COMMON}:vaults`,
    to: subRoutes.vaults,
    pathMatchers: [/^\/vaults\/[^/]+$/],
    trackingActions: ['click::vaults-tile-tab'],
  },
  {
    name: 'billing',
    title: `${BACKUP_AGENT_NAMESPACES.COMMON}:billings`,
    to: subRoutes.billing,
    pathMatchers: [/^\/billing\/[^/]+$/],
    trackingActions: ['click::billing-tile-tab'],
  },
]);
