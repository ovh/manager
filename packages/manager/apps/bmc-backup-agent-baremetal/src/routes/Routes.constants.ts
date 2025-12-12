import { appName } from '@/App.constants';

const ROOT_URL = `/`;

export const subRoutes = Object.freeze({
  onboarding: 'onboarding',
  firstOrder: 'first-order',
  firstOrderConfirmation: 'confirmation',
});

export const urls = Object.freeze({
  root: ROOT_URL,
  onboarding: `${ROOT_URL}${subRoutes.onboarding}`,
  firstOrder: `${ROOT_URL}${subRoutes.firstOrder}`,
  firstOrderConfirmation: `${ROOT_URL}${subRoutes.firstOrder}/${subRoutes.firstOrderConfirmation}`,
});

export const redirectionApp = appName;
