import { TFunction } from 'i18next';

import { ICON_NAME } from '@ovhcloud/ods-react';

import { LocationPathParams, UrlValue } from '@/routes/Routes.constants';

/**
 * Configuration for a single breadcrumb item
 */
export interface BreadcrumbItemConfig {
  /**
   * Translation key for the label, or a static string
   * If starts with a namespace (e.g., "tenants:listing.title"), it will be translated
   */
  labelKey?: string;

  /**
   * Static label to display (takes precedence over labelKey if both are provided)
   */
  label?: string;

  /**
   * Whether this breadcrumb item should be hidden
   * @default false
   */
  hidden?: boolean;

  /**
   * Icon to display instead of text (only for root items typically)
   * Uses ODS icon names from @ovhcloud/ods-react
   */
  icon?: ICON_NAME;

  /**
   * Route path for this breadcrumb item
   * Can include route parameters (e.g., "/tenants/:tenantId")
   * If no label or labelKey is provided, the last path parameter value will be used as label
   */
  path?: string;

  /**
   * Aria label for accessibility (especially useful when using icons)
   */
  ariaLabel?: string;
}

/**
 * Configuration for a specific route's breadcrumb
 */
export interface BreadcrumbRouteConfig {
  /**
   * Route pattern to match, should be a valid URL from urls constant
   * e.g., urls.tenantDashboard ("/observability/metrics/tenants/:resourceName/:tenantId")
   */
  pattern: UrlValue;

  /**
   * Ordered list of breadcrumb items to display for this route
   */
  items: BreadcrumbItemConfig[];
}

/**
 * Complete breadcrumb configuration for the application
 */
export interface BreadcrumbConfig {
  /**
   * Root breadcrumb item configuration (always first)
   */
  root: BreadcrumbItemConfig;

  /**
   * Route-specific breadcrumb configurations
   * Order matters: more specific routes should come first
   * If not provided, falls back to path-based breadcrumb generation
   */
  routes?: BreadcrumbRouteConfig[];

  /**
   * Default behavior when no route config matches
   * If true, falls back to path-based breadcrumb generation
   * @default true
   */
  fallbackToPathBased?: boolean;
}

/**
 * Resolved breadcrumb item ready for rendering
 */
export interface BreadcrumbItem {
  /**
   * Unique key for React rendering
   */
  key: string;

  /**
   * Display label (already translated if applicable)
   */
  label?: string;

  /**
   * Icon to display (from ODS)
   */
  icon?: ICON_NAME;

  /**
   * Navigation href (for external link)
   */
  href?: string;

  /**
   * Navigation to (subroute for react-router)
   */
  to?: string;

  /**
   * Whether this item should be rendered
   */
  hidden: boolean;

  /**
   * Aria label for accessibility
   */
  ariaLabel?: string;

  /**
   * Whether this is the last (current) item
   */
  isLast: boolean;
}

/**
 * Context for creating a single route breadcrumb item
 */
export interface RouteItemContext {
  itemConfig: BreadcrumbItemConfig;
  index: number;
  totalItems: number;
  matchedParams: Record<string, string>;
  appRoot: string;
  t: TFunction;
}

/**
 * Context for resolving all breadcrumb items
 */
export interface ResolveBreadcrumbContext {
  config: BreadcrumbConfig;
  pathname: string;
  routeParams: LocationPathParams;
  rootHref: string;
  t: TFunction;
}
