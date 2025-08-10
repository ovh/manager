/**
 * DashboardTabType.ts
 * -----------------------------------------------------------------------------
 * Type definition for a single dashboard navigation tab.
 */

/**
 * Represents one dashboard tab in the navigation bar.
 *
 * @remarks
 * This structure is used by the dashboard layout to render tab navigation
 * and handle analytics tracking. Tabs are usually defined in
 * `DASHBOARD_TAB_CONFIG`.
 */
export type DashboardTabType = {
  /** Internal identifier for the tab (used for active state detection). */
  name: string;

  /** Display title shown in the UI (translated label). */
  title: string;

  /** Relative route path for the tab (e.g., `'settings'`). */
  to: string;

  /**
   * Optional analytics tracking actions.
   *
   * @example
   * ```ts
   * trackingActions: ['click::settings-tab']
   * ```
   */
  trackingActions?: string[];

  /**
   * Optional list of regular expressions used to detect active state
   * based on the current pathname.
   *
   * @example
   * ```ts
   * pathMatchers: [/\/settings$/, /^\/dashboard\/[^/]+$/]
   * ```
   */
  pathMatchers?: RegExp[];
};
