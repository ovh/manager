import { urls } from '@/routes/routes.constant';

export const PROJECT_TABS = [
  {
    name: 'home',
    titleKey: 'pci_projects_project_home',
    to: urls.home,
  },
  {
    name: 'settings',
    titleKey: 'pci_projects_project_settings',
    to: urls.edit,
  },
] as const;

export type ProjectTab = typeof PROJECT_TABS[number];
