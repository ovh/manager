export const subRoutes = {
  serviceName: ':serviceName',
  domain: ':domain',
  path: ':path',
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
  addDomain: `/${subRoutes.serviceName}/multisite/add-domain`,
  detacheDomain: `/${subRoutes.serviceName}/multisite/${subRoutes.domain}/detache-domain`,
  modifyDomain: `/${subRoutes.serviceName}/multisite/${subRoutes.domain}/modify-domain`,
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

  // MULTISITE
  addWebSite: `/${subRoutes.serviceName}/multisite/add-website`,
  multisite: `/${subRoutes.serviceName}/multisite`,
  editName: `/${subRoutes.serviceName}/multisite/edit-name`,

  // GIT
  associateGit: `/${subRoutes.serviceName}/multisite/${subRoutes.path}/associate-git`,
  configureGit: `/${subRoutes.serviceName}/multisite/${subRoutes.path}/configure-git`,
  deleteGit: `/${subRoutes.serviceName}/multisite/${subRoutes.path}/delete-git`,
  deployeGit: `/${subRoutes.serviceName}/multisite/${subRoutes.path}/deploye-git`,
  lastDeploymentGit: `/${subRoutes.serviceName}/multisite/${subRoutes.path}/last-deployment-git`,

  // CDN
  modifyCdn: `/${subRoutes.serviceName}/multisite/${subRoutes.domain}/modify-cdn`,
  purgeCdn: `/${subRoutes.serviceName}/multisite/${subRoutes.domain}/purge-cdn`,

  // MODULE
  addModule: `/${subRoutes.serviceName}/multisite/add-module`,
  deleteModule: `/${subRoutes.serviceName}/multisite/delete-module/${subRoutes.path}`,
};
