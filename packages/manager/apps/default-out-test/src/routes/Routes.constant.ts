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
 * This is the ONLY place where flavor differences are handled.
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
 * All paths here are relative to the app's root.
 */
export const urls = {
  root: getRoot(),

  /**
   * Dashboard route:
   * - Default has optional :serviceName param (`dashboard/:serviceName?`)
   * - Works for listing or direct detail
   */
  dashboard: `dashboard/${serviceParam}?`,

  /** Onboarding is common across all flavors */
  onboarding: 'onboarding',
} as const;

/**
 * Sub-routes for dashboard tabs / child views.
 * These remain relative to the dashboard route.
 */
export const subRoutes = {
  overview: '' as const,
  settings: 'settings' as const,
  ...(isPci ? { quota: 'quota' as const } : {}),
} as const;

/**
 * Optional: centralized tab configuration.
 * Keeps App.constants.ts free of route imports to avoid circular deps.
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
  // Add PCI-only tabs here if needed
]);
