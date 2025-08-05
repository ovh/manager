export const subRoutes = {
  serviceName: ':serviceName',
  domain: ':domain',
};

export const urls = {
  root: '',
  websites: '/websites',
  onboarding: '/onboarding',
  managedWordpress: '/managed-hosting-for-wordpress',
  managedWordpressResource: `/managed-hosting-for-wordpress/${subRoutes.serviceName}`,
  managedWordpressResourceGeneralInformation: `/managed-hosting-for-wordpress/${subRoutes.serviceName}`,
  managedWordpressResourceImport: `/managed-hosting-for-wordpress/${subRoutes.serviceName}/import`,
  managedWordpressResourceTasks: `/managed-hosting-for-wordpress/${subRoutes.serviceName}/tasks`,
  dashboard: `/${subRoutes.serviceName}`,
  orderDomain: `/${subRoutes.serviceName}/order-domain`,
  addDomain: `/${subRoutes.serviceName}/add-domain`,
  ssl: `/${subRoutes.serviceName}/ssl`,
  hosting: '/web/hosting',
  importSsl: `/${subRoutes.serviceName}/import-ssl`,
  orderSectigo: `/${subRoutes.serviceName}/order-sectigo`,
  disableSsl: `/${subRoutes.serviceName}/${subRoutes.domain}/disable-ssl`,
  sanSsl: `/${subRoutes.serviceName}/${subRoutes.domain}/san-ssl`,
};
