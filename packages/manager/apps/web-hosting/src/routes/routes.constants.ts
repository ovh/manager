export const subRoutes = {
  serviceName: ':serviceName',
  domain: ':domain',
};

export const urls = {
  // ROOT
  root: '',
  hosting: '/web/hosting',

  // COMMON
  onboarding: '/onboarding',
  websites: '/websites',
  dashboard: `/${subRoutes.serviceName}`,

  // DOMAIN
  addDomain: `/${subRoutes.serviceName}/add-domain`,
  orderDomain: `/${subRoutes.serviceName}/order-domain`,

  // SSL
  disableSsl: `/${subRoutes.serviceName}/${subRoutes.domain}/disable-ssl`,
  importSsl: `/${subRoutes.serviceName}/import-ssl`,
  orderSectigo: `/${subRoutes.serviceName}/order-sectigo`,
  sanSsl: `/${subRoutes.serviceName}/${subRoutes.domain}/san-ssl`,
  ssl: `/${subRoutes.serviceName}/ssl`,
};
