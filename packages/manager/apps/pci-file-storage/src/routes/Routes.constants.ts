import { appName } from '@/App.constants';

const ROOT_URL = `/pci/projects/:projectId/storages/files/`;

export const subRoutes = {
  onboarding: 'onboarding' as const,
  create: 'new' as const,
  list: '' as const,
  shareDetail: ':region/:shareId' as const,
  shareSnapshots: 'snapshots' as const,
  shareAcl: 'acl' as const,
  shareDelete: 'delete' as const,
} as const;

export const urls = {
  root: ROOT_URL,
  onboarding: `${ROOT_URL}${subRoutes.onboarding}`,
  create: `${ROOT_URL}${subRoutes.create}`,
  list: `${ROOT_URL}${subRoutes.list}`,
} as const;

export const redirectionApp = appName;
