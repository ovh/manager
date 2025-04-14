export const subRoutes = {
  serviceName: ':serviceName',
};

export const urls = {
  root: '',
  websites: '/websites',
  onboarding: '/onboarding',
  dashboard: `/${subRoutes.serviceName}`,
  ssl: `/${subRoutes.serviceName}/ssl`,
  hosting: '/web/hosting',
};
