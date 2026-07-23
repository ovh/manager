export const subRoutes = {
  onboarding: 'onboarding' as const,
  order: 'order' as const,
} as const;

// Absolute paths for cross-page navigation (routes are mounted under "/" by the consumer app).
export const routeUrls = {
  onboarding: `/${subRoutes.onboarding}`,
  order: `/${subRoutes.order}`,
} as const;

// TODO(BKP-1208): dashboard route does not exist yet (ticket 1.1).
// Until it ships, this intentionally falls through to the consumer app's catch-all "*" route.
export const stubRoutes = {
  dashboard: '/dashboard',
} as const;
