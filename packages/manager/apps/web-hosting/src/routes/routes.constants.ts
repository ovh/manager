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
  importSsl: `/${subRoutes.serviceName}/import-ssl`,
  orderSectigo: `/${subRoutes.serviceName}/order-sectigo`,
  disableSsl: `/${subRoutes.serviceName}/${subRoutes.domain}/disable-ssl`,
  regenerateSsl: `/${subRoutes.serviceName}/${subRoutes.domain}/regenerate-ssl`,
  sanSsl: `/${subRoutes.serviceName}/${subRoutes.domain}/san-ssl`,
};
