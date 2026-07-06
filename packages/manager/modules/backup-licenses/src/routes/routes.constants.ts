import { BACKUP_LICENSES_NAMESPACES } from "@/BackupLicenses.translations";
import { NAMESPACES } from "@ovh-ux/manager-common-translations";

export const subRoutes = {} as const;

export const urlParams = {} as const;

export const urls = {
  root: `/`,
  onboarding: `/onboarding`,
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
])