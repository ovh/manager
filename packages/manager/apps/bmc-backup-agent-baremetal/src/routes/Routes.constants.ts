import { appName } from '@/App.constants';

const ROOT_URL = `/`;

export const subRoutes = Object.freeze({
  onboarding: 'onboarding',
  tunnel: 'tunnel',
});

export const urls = Object.freeze({
  root: ROOT_URL,
  onboarding: `${ROOT_URL}${subRoutes.onboarding}`,
  tunnel: `${ROOT_URL}${subRoutes.tunnel}`,
});

export const redirectionApp = appName;
