import { urls } from '@/routes/routes.constant';
import { PROJECTS_TRACKING } from '@/tracking.constant';

export const PROJECT_TABS = [
  {
    name: 'home',
    titleKey: 'pci_projects_home_home',
    to: urls.home,
    tracking: PROJECTS_TRACKING.TABS.HOME_TAB,
  },
  {
    name: 'settings',
    titleKey: 'pci_projects_home_settings',
    to: urls.edit,
    tracking: PROJECTS_TRACKING.TABS.SETTINGS_TAB,
  },
] as const;

export type ProjectTab = (typeof PROJECT_TABS)[number];
