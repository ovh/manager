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
  editName: `/${subRoutes.serviceName}/edit-name`,
  dashboard_terminate: `/${subRoutes.serviceName}/terminate`,
  listing_terminate: `/terminate/${subRoutes.serviceName}`,
} as const;
