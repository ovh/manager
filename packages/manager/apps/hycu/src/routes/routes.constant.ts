export const subRoutes = {
  edit: 'edit',
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
  edit: `/${subRoutes.serviceName}/${subRoutes.edit}`,
} as const;
