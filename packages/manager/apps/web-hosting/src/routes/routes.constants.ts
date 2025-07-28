export const subRoutes = {
  serviceName: ':serviceName',
  domain: ':domain',
};

export const urls = {
  // ROOT
  root: '',
  wordpressManaged: '/wordpress-managed',
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

  // MANAGED CMS
  managedWordpressResource: `/managed-hosting-for-wordpress/${subRoutes.serviceName}`,
  managedWordpressResourceGeneralInformation: `/managed-hosting-for-wordpress/${subRoutes.serviceName}`,
  managedWordpressResourceCreate: `/managed-hosting-for-wordpress/${subRoutes.serviceName}/create`,
  managedWordpressResourceImport: `/managed-hosting-for-wordpress/${subRoutes.serviceName}/import`,
  managedWordpressResourceTasks: `/managed-hosting-for-wordpress/${subRoutes.serviceName}/tasks`,
  managedWordpressResourceDeleteModal: `/managed-hosting-for-wordpress/${subRoutes.serviceName}/delete-modal`,
};
