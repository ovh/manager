export const subRoutes = {
  serviceName: ':serviceName',
  domain: ':domain',
  locationId: ':locationId',
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
  importSsl: `/${subRoutes.serviceName}/import-ssl`,
  orderSectigo: `/${subRoutes.serviceName}/order-sectigo`,
  disableSsl: `/${subRoutes.serviceName}/${subRoutes.domain}/disable-ssl`,
  sanSsl: `/${subRoutes.serviceName}/${subRoutes.domain}/san-ssl`,
  localSeo: `/${subRoutes.serviceName}/localSeo`,
  removeSeoSubsciption: `/${subRoutes.serviceName}/localSeo/${subRoutes.locationId}/terminate`,
};
