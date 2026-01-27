import { appName } from '@/App.constants';

const ROOT_URL = `/pci/projects/:projectId/storages/files/`;

export const subRoutes = {
  onboarding: 'onboarding' as const,
  create: 'new' as const,
} as const;

export const urls = {
  root: ROOT_URL,
  onboarding: `${ROOT_URL}${subRoutes.onboarding}`,
  create: `${ROOT_URL}${subRoutes.create}`,
} as const;

export const redirectionApp = appName;
