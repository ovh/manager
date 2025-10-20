import { urls } from '@/routes/routes.constant';

export const PROJECT_TABS = [
  {
    name: 'home',
    titleKey: 'pci_projects_home_home',
    to: urls.home,
  },
  {
    name: 'settings',
    titleKey: 'pci_projects_home_settings',
    to: urls.edit,
  },
] as const;

export type ProjectTab = typeof PROJECT_TABS[number];
