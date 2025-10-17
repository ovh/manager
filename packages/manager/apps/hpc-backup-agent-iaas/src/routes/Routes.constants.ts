const ROOT_URL = '';

export const subRoutes = {
  onboarding: 'onboarding' as const,
  dashboard: ':tenantId' as const,
  delete: 'delete' as const,
} as const;

export const urls = {
  root: ROOT_URL,
  listing: ROOT_URL,
  listingTenantDelete: `${ROOT_URL}/${subRoutes.delete}`,
  onboarding: `${ROOT_URL}/${subRoutes.onboarding}`,
  dashboard: `${ROOT_URL}/${subRoutes.dashboard}`,
  dashboardTenantDelete: `${ROOT_URL}/${subRoutes.dashboard}/${subRoutes.delete}`,
} as const;
