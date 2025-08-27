export const subRoutes = {
  serviceName: ':serviceName',
  domain: ':domain',
  locationId: ':locationId',
};

export const urls = {
  // ROOT
  root: '',
  managedWordpress: '/managed-hosting-for-wordpress',
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

  // TASK
  task: `/${subRoutes.serviceName}/task`,

  // LOCAL SEO
  localSeo: `/${subRoutes.serviceName}/localSeo`,
  removeSeoSubsciption: `/${subRoutes.serviceName}/localSeo/${subRoutes.locationId}/terminate`,

  // MANAGED CMS
  managedWordpressResource: `/managed-hosting-for-wordpress/${subRoutes.serviceName}`,
  managedWordpressResourceGeneralInformation: `/managed-hosting-for-wordpress/${subRoutes.serviceName}`,
  managedWordpressResourceCreate: `/managed-hosting-for-wordpress/${subRoutes.serviceName}/create`,
  managedWordpressResourceImport: `/managed-hosting-for-wordpress/${subRoutes.serviceName}/import`,
  managedWordpressResourceTasks: `/managed-hosting-for-wordpress/${subRoutes.serviceName}/tasks`,
  managedWordpressResourceDeleteModal: `/managed-hosting-for-wordpress/${subRoutes.serviceName}/delete-modal`,
};
