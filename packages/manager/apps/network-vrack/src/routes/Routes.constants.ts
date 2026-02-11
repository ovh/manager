import { appName } from '@/App.constants';

const ROOT_URL = '/vrack';

export const subRoutes = {
  onboarding: 'onboarding' as const,
  dashboard: ':serviceName' as const,
  ip: ':ip' as const,
} as const;

export const urls = {
  root: ROOT_URL,
  onboarding: `${ROOT_URL}/${subRoutes.onboarding}`,
  dashboard: `${ROOT_URL}/${subRoutes.dashboard}`,
  detachIpv4: `${ROOT_URL}/${subRoutes.dashboard}/${subRoutes.ip}/detach`,
} as const;

export const redirectionApp = appName;
