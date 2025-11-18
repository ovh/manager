import { appName } from '@/App.constants';

const ROOT_URL = `/`;

export const subRoutes = Object.freeze({
  onboarding: 'onboarding',
  firstOrder: 'first-order',
});

export const urls = Object.freeze({
  root: ROOT_URL,
  onboarding: `${ROOT_URL}${subRoutes.onboarding}`,
});

export const redirectionApp = appName;
