import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { BACKUP_LICENSES_NAMESPACES } from '@/BackupLicenses.translations';

export const subRoutes = {
  onboarding: 'onboarding' as const,
  order: 'order' as const,
} as const;

export const urlParams = {} as const;

export const urls = {
  root: `/`,
  onboarding: `/${subRoutes.onboarding}`,
} as const;

// Absolute paths for cross-page navigation (routes are mounted under "/" by the consumer app).
export const routeUrls = {
  onboarding: `/${subRoutes.onboarding}`,
  order: `/${subRoutes.order}`,
} as const;

// TODO(BKP-1208): dashboard route does not exist yet on this branch (ticket 1.1).
// En attendant, on cible directement l'URL du premier onglet du futur dashboard
// (`/linked-servers`, cf. BKP-1216) plutôt qu'un stub qui tombe dans le catch-all "*".
export const stubRoutes = {
  dashboard: '/linked-servers',
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
