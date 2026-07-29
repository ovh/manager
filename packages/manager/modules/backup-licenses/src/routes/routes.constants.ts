import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { BACKUP_LICENSES_NAMESPACES } from '@/BackupLicenses.translations';

export const subRoutes = {
  onboarding: 'onboarding',
} as const;

export const urlParams = {} as const;

export const urls = {
  root: `/`,
  onboarding: `/${subRoutes.onboarding}`,
} as const;

// TODO(BKP-1206): neither route exists yet (ticket 0.2 — order funnel, ticket 1.1 — dashboard).
// Until they ship, these intentionally fall through to the consumer app's catch-all "*" route.
export const stubRoutes = {
  orderFunnel: '/order',
  dashboard: '/dashboard',
} as const;

export const MAIN_LAYOUT_NAV_TABS = Object.freeze([
  {
    name: 'general_information',
    title: `${NAMESPACES.DASHBOARD}:general_information`,
    to: `${urls.root}`,
    pathMatchers: [/^\/general_information\/[^/]+$/],
    trackingActions: ['click::general_information-tile-tab'],
  },
  {
    name: 'other_tab',
    title: `${BACKUP_LICENSES_NAMESPACES.COMMON}:other_tab`,
    to: `${urls.root}`,
    pathMatchers: [/^\/other_tabs\/[^/]+$/],
    trackingActions: ['click::other_tab-tile-tab'],
  },
]);
