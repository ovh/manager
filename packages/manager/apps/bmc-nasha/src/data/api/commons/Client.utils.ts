import { APP_FEATURES } from '@/App.constants';

/**
 * Resolve the listing route with proper interpolation
 */
export function resolveListingRoute(): string {
  return APP_FEATURES.listingEndpoint;
}

/**
 * Resolve the dashboard route with service name interpolation
 */
export function resolveDashboardRoute(serviceName: string): string {
  return APP_FEATURES.dashboardEndpoint.replace('{serviceName}', serviceName);
}

/**
 * Normalize route parameters for API calls
 */
export function normalizeRouteParams(params: Record<string, any>): Record<string, any> {
  const normalized: Record<string, any> = {};
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      normalized[key] = value;
    }
  });
  
  return normalized;
}
