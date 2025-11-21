import { appName } from '@/App.constants';

const ROOT_URL = `/`;

export const subRoutes = {
  onboarding: 'onboarding' as const,
} as const;

export const urls = {
  root: ROOT_URL,
  onboarding: `${ROOT_URL}${subRoutes.onboarding}`,
} as const;

export const redirectionApp = appName;
