export const subRoutes = {
  serviceName: ':serviceName',
  domain: ':domain',
  locationId: ':locationId',
  // splat: a website path can contain slashes (e.g. "test/public"), so it must stay last in the url,
  // behind the static "website" segment so it can't collide with /multisite/:domain/<action> routes
  path: '*',
  serviceId: ':serviceId',
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

  // LOGS
  logs: `/${subRoutes.serviceName}/user-logs`,

  // LOCAL SEO
  localSeo: `/${subRoutes.serviceName}/localSeo`,
  removeSeoSubsciption: `/${subRoutes.serviceName}/localSeo/${subRoutes.locationId}/terminate`,

  // MANAGED CMS
  managedWordpressResource: `/managed-hosting-for-wordpress/${subRoutes.serviceName}`,
  managedWordpressResourceOnboarding: `/managed-hosting-for-wordpress/onboarding`,
  managedWordpressResourceGeneralInformation: `/managed-hosting-for-wordpress/${subRoutes.serviceName}`,
  managedWordpressResourceCreate: `/managed-hosting-for-wordpress/${subRoutes.serviceName}/create`,
  managedWordpressResourceImport: `/managed-hosting-for-wordpress/${subRoutes.serviceName}/import`,
  managedWordpressResourceTasks: `/managed-hosting-for-wordpress/${subRoutes.serviceName}/tasks`,
  managedWordpressResourceDeleteModal: `/managed-hosting-for-wordpress/${subRoutes.serviceName}/delete-modal`,

  // MULTISITE
  addWebSite: `/${subRoutes.serviceName}/multisite/add-website`,
  multisite: `/${subRoutes.serviceName}/multisite`,
  editName: `/${subRoutes.serviceName}/multisite/edit-name`,
  editSite: `/${subRoutes.serviceName}/multisite/edit-site`,
  deleteSite: `/${subRoutes.serviceName}/multisite/website/delete-site/${subRoutes.path}`,

  // GIT
  associateGit: `/${subRoutes.serviceName}/multisite/website/associate-git/${subRoutes.path}`,
  configureGit: `/${subRoutes.serviceName}/multisite/website/configure-git/${subRoutes.path}`,
  deleteGit: `/${subRoutes.serviceName}/multisite/website/delete-git/${subRoutes.path}`,
  deployeGit: `/${subRoutes.serviceName}/multisite/website/deploye-git/${subRoutes.path}`,
  lastDeploymentGit: `/${subRoutes.serviceName}/multisite/website/last-deployment-git/${subRoutes.path}`,

  // CDN
  modifyCdn: `/${subRoutes.serviceName}/multisite/${subRoutes.domain}/modify-cdn`,
  purgeCdn: `/${subRoutes.serviceName}/multisite/${subRoutes.domain}/purge-cdn`,
  advancedFlushCdn: `/${subRoutes.serviceName}/multisite/${subRoutes.domain}/advanced-flush-cdn`,
  cdnCacheRule: `/${subRoutes.serviceName}/multisite/${subRoutes.domain}/cdn-cache-rule`,
  cdnEditUrls: `/${subRoutes.serviceName}/multisite/${subRoutes.domain}/cdn-edit-urls`,
  cdnCorsResourceSharing: `/${subRoutes.serviceName}/multisite/${subRoutes.domain}/cdn-cors-resource-sharing`,
  cdnConfirmation: `/${subRoutes.serviceName}/multisite/${subRoutes.domain}/cdn-confirmation`,
  activateCdn: `/${subRoutes.serviceName}/multisite/${subRoutes.domain}/activate-cdn`,

  // MODULE
  addModule: `/${subRoutes.serviceName}/multisite/add-module`,
  deleteModule: `/${subRoutes.serviceName}/multisite/website/delete-module/${subRoutes.path}`,

  // VIDEO CENTER
  videoCenter: '/video-center',
  videoCenterDashboard: `/video-center/${subRoutes.serviceId}`,
  videoCenterFreemiumDashboard: `/video-center-freemium/${subRoutes.serviceId}`,
  videoCenterOnboarding: `/video-center/${subRoutes.serviceId}/onboarding`,
  videoCenterOrder: `/video-center/${subRoutes.serviceId}/order`,
  videoCenterActivate: `/video-center/${subRoutes.serviceId}/activate`,
};
