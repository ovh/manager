export const subRoutes = {
  serviceName: ':serviceName',
  domain: ':domain',
  path: ':path',
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
  detacheDomain: `/${subRoutes.serviceName}/multisite/${subRoutes.domain}/detache-domain`,
  modifyDomain: `/${subRoutes.serviceName}/multisite/${subRoutes.domain}/modify-domain`,
  orderDomain: `/${subRoutes.serviceName}/order-domain`,

  // SSL
  disableSsl: `/${subRoutes.serviceName}/${subRoutes.domain}/disable-ssl`,
  importSsl: `/${subRoutes.serviceName}/import-ssl`,
  orderSectigo: `/${subRoutes.serviceName}/order-sectigo`,
  sanSsl: `/${subRoutes.serviceName}/${subRoutes.domain}/san-ssl`,
  ssl: `/${subRoutes.serviceName}/ssl`,

  // MULTISITE
  addWebSite: `/${subRoutes.serviceName}/multisite/add-website`,
  multisite: `/${subRoutes.serviceName}/multisite`,

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
  addModule: `/${subRoutes.serviceName}/add-module`,
  deleteModule: `/${subRoutes.serviceName}/delete-module/${subRoutes.path}`,
};
