export const subRoutes = {
  onboarding: 'onboarding',
  serviceName: ':serviceName',
};

export const urls = {
  root: '/',
  onboarding: `/${subRoutes.onboarding}`,
  listing: '/',
  dashboard: `/${subRoutes.serviceName}`,
  tab2: 'Tab2',
} as const;
