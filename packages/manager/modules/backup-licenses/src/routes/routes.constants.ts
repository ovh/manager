export const subRoutes = {
  onboarding: 'onboarding' as const,
} as const;

// TODO(BKP-1206): neither route exists yet (ticket 0.2 — order funnel, ticket 1.1 — dashboard).
// Until they ship, these intentionally fall through to the consumer app's catch-all "*" route.
export const stubRoutes = {
  orderFunnel: '/order',
  dashboard: '/dashboard',
} as const;
