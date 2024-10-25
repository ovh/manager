export const subRoutes = {
  onboarding: 'onboarding',
  order: 'order',
  serviceName: ':serviceName',
};

export const urls = {
  root: '/',
  listing: '/',
  onboarding: `/${subRoutes.onboarding}`,
  order: `/${subRoutes.order}`,
  dashboard: `/${subRoutes.serviceName}`,
  activateLicense: `/${subRoutes.serviceName}/activate-license`,
  regenerateLicense: `/${subRoutes.serviceName}/regenerate-license`,
} as const;
