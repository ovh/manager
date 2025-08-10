import { APP_FEATURES, appName } from '@/App.constants';

type RouteFlavor = 'generic' | 'pci' | 'platformParam';

const {
  isPci,
  basePrefix,
  serviceParam = ':serviceName',
  platformParam = ':platformId',
  appSlug = appName,
} = APP_FEATURES;

const routeFlavor: RouteFlavor = (APP_FEATURES.routeFlavor ?? 'generic') as RouteFlavor;

/**
 * Compute the root path from the flavor config.
 *
 * @remarks
 * This is the **single source of truth** for how the application's root route
 * is determined across different deployment flavors:
 *
 * - `'pci'`: Mounted under `/pci/projects/:projectId/<appSlug>`
 * - `'platformParam'`: Mounted under `/:platformId`
 * - `'generic'`: Mounted under `/<appSlug>`
 *
 * The optional `basePrefix` is prepended to all flavors if defined.
 *
 * @returns Computed root path string to be used as the entry point for React Router.
 *
 * @example
 * ```ts
 * // Example: PCI flavor with prefix "eu"
 * APP_FEATURES = { routeFlavor: 'pci', basePrefix: 'eu', appSlug: 'billing' }
 * getRoot(); // "/eu/pci/projects/:projectId/billing"
 * ```
 */
function getRoot(): string {
  const prefix = basePrefix ? `/${String(basePrefix)}` : '';

  if (routeFlavor === 'pci') {
    return `${prefix}/pci/projects/:projectId/${appSlug}`;
  }

  if (routeFlavor === 'platformParam') {
    return `${prefix}/${platformParam.replace(/^:/, '')}`;
  }

  return `${prefix}/${appSlug}`;
}

/**
 * Major app entry points.
 *
 * @remarks
 * These are top-level routes that remain stable across different
 * flavors of the application. They are always expressed **relative
 * to the app's root path** (computed via {@link getRoot}).
 */
export const urls = {
  /** Root entrypoint, flavor-aware */
  root: getRoot(),

  /**
   * Dashboard route.
   *
   * - Pattern: `dashboard/:serviceName?`
   * - The optional `:serviceName` parameter supports either listing view or direct service detail.
   */
  dashboard: `dashboard/${serviceParam}?`,

  /** Onboarding route, common to all flavors */
  onboarding: 'onboarding',
} as const;

/**
 * Sub-routes for dashboard child views.
 *
 * @remarks
 * These are always relative to the `urls.dashboard` route.
 * PCI-only views (e.g., quota) are conditionally included.
 */
export const subRoutes = {
  /** Overview tab (default child) */
  overview: '' as const,
  /** Settings tab */
  settings: 'settings' as const,
  /** PCI-only quota tab */
  ...(isPci ? { quota: 'quota' as const } : {}),
} as const;

/**
 * Centralized configuration for dashboard tabs.
 *
 * @remarks
 * This structure allows UI components to render tab navigation
 * without hardcoding paths, titles, or tracking info.
 *
 * - `name`: internal identifier
 * - `title`: display label
 * - `to`: relative route (see {@link subRoutes})
 * - `pathMatchers`: regex matchers for active state
 * - `trackingActions`: tracking identifiers for analytics
 *
 * @example
 * ```ts
 * DASHBOARD_TAB_CONFIG.forEach(tab => {
 *   console.log(tab.name, tab.to);
 * });
 * // "overview" ""
 * // "settings" "settings"
 * ```
 */
export const DASHBOARD_TAB_CONFIG = Object.freeze([
  {
    name: 'overview',
    title: 'Overview',
    to: subRoutes.overview,
    pathMatchers: [/^\/dashboard\/[^/]+$/],
    trackingActions: ['click::overview-tab'],
  },
  {
    name: 'settings',
    title: 'Settings',
    to: subRoutes.settings,
    pathMatchers: [/\/settings$/],
    trackingActions: ['click::settings-tab'],
  },
  // PCI-only tabs can be added here if needed
]);

/**
 * Resolve the application identifier to use for ErrorBoundary redirection.
 *
 * @remarks
 * - In PCI flavor, use the short slug (`appSlug`) to match Manager shell expectations.
 * - In generic flavor, fall back to the global `appName`.
 *
 * @example
 * ```ts
 * if (APP_FEATURES.isPci) {
 *   console.log(redirectionApp); // "my-app-slug"
 * } else {
 *   console.log(redirectionApp); // "manager-app"
 * }
 * ```
 */
export const redirectionApp = APP_FEATURES.isPci
  ? APP_FEATURES.appSlug // for PCI, shell expects the short app slug
  : appName;
