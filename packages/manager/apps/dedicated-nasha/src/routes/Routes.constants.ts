import { appName } from '@/App.constants';

const ROOT_URL = `/`;

export const subRoutes = {
  onboarding: 'onboarding' as const,
  listing: 'listing' as const,
  dashboard: 'nasha/:serviceName' as const,
  partitions: 'nasha/:serviceName/partitions' as const,
} as const;

export const urls = {
  root: ROOT_URL,
  onboarding: `${ROOT_URL}${subRoutes.onboarding}`,
  listing: `${ROOT_URL}${subRoutes.listing}`,
  dashboard: `${ROOT_URL}nasha/:serviceName`,
  partitions: `${ROOT_URL}nasha/:serviceName/partitions`,
} as const;

export const redirectionApp = appName;
