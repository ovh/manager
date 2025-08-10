import { useMemo } from 'react';

import { useLocation, useParams } from 'react-router-dom';

import { DASHBOARD_TAB_CONFIG } from '@/routes/Routes.utils';
import { DashboardTabType } from '@/types/Dashboard.type';

/**
 * Resolves dashboard tabs for the current route.
 *
 * - Replaces any `:id` placeholder in each tab's `to` with the route param `id`.
 * - Marks a tab as active when:
 *   1) `pathname === resolvedTo`, or
 *   2) any `pathMatchers` regex on the tab matches the current `pathname`.
 * - Memoized by the current `pathname` and `id`.
 *
 * @returns The list of {@link DashboardTabType} with `to` resolved and `isActive` computed.
 *
 * @example
 * ```ts
 * // Given:
 * // DASHBOARD_TAB_CONFIG = [
 * //   { key: 'overview', label: 'Overview', to: '/app/:id', pathMatchers: [/^\/app\/[^/]+$/] },
 * //   { key: 'settings', label: 'Settings', to: '/app/:id/settings' },
 * // ]
 * // URL: /app/abc/settings
 * const tabs = useDashboardTabs();
 * // tabs[0].to === '/app/abc'            // overview
 * // tabs[1].to === '/app/abc/settings'   // settings
 * // tabs[1].isActive === true
 * ```
 */
export function useDashboardTabs(): DashboardTabType[] {
  const { pathname } = useLocation();
  const { id } = useParams<{ id: string }>();

  return useMemo(
    () =>
      DASHBOARD_TAB_CONFIG.map((tab) => {
        const resolvedTo = tab.to.replace(':id', id ?? '');
        return {
          ...tab,
          to: resolvedTo,
          isActive: pathname === resolvedTo || tab.pathMatchers?.some((rx) => rx.test(pathname)),
        };
      }),
    [pathname, id],
  );
}
