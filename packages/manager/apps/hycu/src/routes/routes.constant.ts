export const subRoutes = {
  editPack: 'edit-pack',
  onboarding: 'onboarding',
  order: 'order',
  serviceName: ':serviceName',
};

export const urls = {
  root: '/',
  listing: '/',
  onboarding: `/${subRoutes.onboarding}`,
  order: `/${subRoutes.order}`,
  dashboard: `/${subRoutes.serviceName}`,
  editPack: `/${subRoutes.serviceName}/${subRoutes.editPack}`,
  activateLicense: `/${subRoutes.serviceName}/activate-license`,
  regenerateLicense: `/${subRoutes.serviceName}/regenerate-license`,
  editName: `/${subRoutes.serviceName}/edit-name`,
  dashboard_terminate: `/${subRoutes.serviceName}/terminate`,
  listing_terminate: `/terminate/${subRoutes.serviceName}`,
} as const;
