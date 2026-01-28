import { ICON_NAME } from '@ovhcloud/ods-react';

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
   */
  path?: string;

  /**
   * If true, uses the URL segment value as the label
   * Useful for dynamic segments like tenant IDs
   * @default false
   */
  useSegmentAsLabel?: boolean;

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
   * Route pattern to match (can include wildcards)
   * e.g., "/metrics/tenants/:resourceName/:tenantId"
   */
  pattern: string;

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
   * Navigation href (for react-router)
   */
  href: string;

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
