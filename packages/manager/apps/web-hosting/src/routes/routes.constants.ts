export const subRoutes = {
  serviceName: ':serviceName',
  domain: ':domain',
};

export const urls = {
  // ROOT
  root: '',
<<<<<<< HEAD
  wordpressManaged: '/wordpress-managed',
=======
  websites: '/websites',
  onboarding: '/onboarding',
  managedWordpress: '/managed-wordpress',
  managedWordpressResource: `/managed-wordpress/${subRoutes.serviceName}`,
  managedWordpressResourceGeneralInformation: `/managed-wordpress/${subRoutes.serviceName}`,
  managedWordpressResourceTasks: `/managed-wordpress/${subRoutes.serviceName}/tasks`,
  dashboard: `/${subRoutes.serviceName}`,
  orderDomain: `/${subRoutes.serviceName}/order-domain`,
  addDomain: `/${subRoutes.serviceName}/add-domain`,
  ssl: `/${subRoutes.serviceName}/ssl`,
>>>>>>> 8271b8fadde (feat(web-hosting): add listing pages resource and websites)
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
};
