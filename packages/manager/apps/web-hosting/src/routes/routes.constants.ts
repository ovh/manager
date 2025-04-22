export const subRoutes = {
  serviceName: ':serviceName',
  domain: ':domain',
};

export const urls = {
  root: '',
  websites: '/websites',
  onboarding: '/onboarding',
  dashboard: `/${subRoutes.serviceName}`,
  ssl: `/${subRoutes.serviceName}/ssl`,
  hosting: '/web/hosting',
  disableSsl: `/${subRoutes.serviceName}/${subRoutes.domain}/disable-ssl`,
  regenerateSsl: `/${subRoutes.serviceName}/${subRoutes.domain}/regenerate-ssl`,
};
