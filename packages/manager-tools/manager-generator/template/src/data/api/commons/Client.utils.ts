/**
 * Client.utils.ts
 * -----------------------------------------------------------------------------
 * Helpers used by the API & hooks layer:
 * - Path normalization (leading slash).
 * - Runtime interpolation of route params.
 * - Resolution of listing/onboarding routes from constants.
 */
import * as AppC from '@/App.constants';

/**
 * Ensure a route string starts with a leading slash (`/`).
 *
 * - If the input is empty or falsy, returns `'/'`.
 * - If already prefixed with `/`, returns unchanged.
 * - Otherwise, prepends `/`.
 *
 * @param route - Route string to normalize.
 * @returns Normalized route starting with `/`.
 *
 * @example
 * ```ts
 * ensureLeadingSlash('users');   // "/users"
 * ensureLeadingSlash('/login');  // "/login"
 * ensureLeadingSlash('');        // "/"
 * ```
 */
export function ensureLeadingSlash(route: string): string {
  if (!route) return '/';
  return route.startsWith('/') ? route : `/${route}`;
}

/**
 * Interpolates placeholders in a route string with runtime values.
 *
 * Supports both:
 * - Curly braces (`{param}`).
 * - Colon-style (`:param`).
 *
 * Undefined values are replaced with an empty string.
 *
 * @typeParam T - Shape of the parameter object (keys must match placeholders).
 * @param route - Route string containing placeholders.
 * @param params - Key-value pairs for substitution.
 * @returns Interpolated route string.
 *
 * @example
 * ```ts
 * interpolatePath('/email/domain/{domain}', { domain: 'example.com' });
 * // "/email/domain/example.com"
 *
 * interpolatePath('/okms/resource/:okmsId', { okmsId: 'svc-123' });
 * // "/okms/resource/svc-123"
 * ```
 */
export function interpolatePath<T extends Record<string, string | number | undefined>>(
  route: string,
  params?: T,
): string {
  if (!params) return route;
  return Object.entries(params).reduce((acc, [key, value]) => {
    const safe = value ?? '';
    return acc
      .replace(new RegExp(`{${key}}`, 'g'), String(safe))
      .replace(new RegExp(`:${key}(?![a-zA-Z0-9_])`, 'g'), String(safe));
  }, route);
}

/**
 * Resolve the listing API route from application constants.
 *
 * - Uses `LISTING_API_ROUTE` or (legacy) `listingEndpoint` naming schemes.
 * - Normalizes result with `ensureLeadingSlash`.
 * - Supports runtime param interpolation.
 *
 * @param params - Optional key-value params to substitute into the route.
 * @returns Resolved listing route string.
 *
 * @example
 * ```ts
 * const route = resolveListingRoute({ projectId: 'p-123' });
 * // e.g. "/cloud/project/p-123/resources"
 * ```
 */
export function resolveListingRoute(params?: Record<string, string | number>): string {
  const raw = ((AppC.LISTING_API_ROUTE as string | undefined) ?? '')?.split('-')?.[0] || '';
  return ensureLeadingSlash(interpolatePath(raw, params));
}

/**
 * Resolve the onboarding API route from application constants.
 *
 * - Uses `ONBOARDING_API_ROUTE` or (legacy) `onboardingEndpoint` naming schemes.
 * - Normalizes result with `ensureLeadingSlash`.
 * - Supports runtime param interpolation.
 *
 * @param params - Optional key-value params to substitute into the route.
 * @returns Resolved onboarding route string, or `'/'` if constant is undefined.
 *
 * @example
 * ```ts
 * const route = resolveOnboardingRoute({ domain: 'example.com' });
 * // e.g. "/email/domain/example.com/onboarding"
 * ```
 */
export function resolveOnboardingRoute(
  params?: Record<string, string | number>,
): string | undefined {
  const raw = ((AppC.ONBOARDING_API_ROUTE as string | undefined) ?? '')?.split('-')?.[0] || '';
  return ensureLeadingSlash(interpolatePath(raw, params));
}
