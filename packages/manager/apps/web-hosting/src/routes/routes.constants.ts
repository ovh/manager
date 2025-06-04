export const subRoutes = {
  serviceName: ':serviceName',
};

export const urls = {
  root: '',
  websites: '/websites',
  onboarding: '/onboarding',
  dashboard: `/${subRoutes.serviceName}`,
  orderDomain: `/${subRoutes.serviceName}/order-domain`,
  addDomain: `/${subRoutes.serviceName}/add-domain`,
  ssl: `/${subRoutes.serviceName}/ssl`,
  hosting: '/web/hosting',
};
