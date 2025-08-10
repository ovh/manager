/**
 * DashboardPage.tsx
 * -----------------------------------------------------------------------------
 * Main dashboard container page.
 *
 * Responsibilities:
 * - Provides the **base layout** (`BaseLayout`) with header, breadcrumb, and optional tabs.
 * - Dynamically builds **tabs** from `useDashboardTabs` with routing and click tracking.
 * - Computes **breadcrumb items** via `useBreadcrumb`.
 * - Wraps child routes in `React.Suspense` with fallback rendering.
 *
 * Features:
 * - Active tab detection based on current location pathname.
 * - Tracking integration: sends click events when a tab is selected.
 * - i18n integration for breadcrumb root label.
 *
 * Routing:
 * - Uses `Outlet` to render nested subroutes (e.g., dashboard sections).
 */
import React, { Suspense, useMemo } from 'react';

import { NavLink, Outlet, useLocation } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { OdsTab, OdsTabs } from '@ovhcloud/ods-components/react';

import { BaseLayout, HeadersProps } from '@ovh-ux/manager-react-components';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import Breadcrumb from '@/components/breadcrumb/Breadcrumb.component';
import { useBreadcrumb } from '@/hooks/breadcrumb/useBreadcrumb';
import { useDashboardHeader } from '@/hooks/dashboard/useDashboardHeader';
import { useDashboardTabs } from '@/hooks/dashboard/useDashboardTabs';

/**
 * Dashboard page component.
 *
 * - Renders the OVHcloud manager **dashboard shell** with breadcrumb, header, and tabs.
 * - Uses route-aware logic to determine the active tab.
 * - Delegates nested content rendering to `Outlet`.
 *
 * @returns React component for the dashboard page.
 *
 * @example
 * ```tsx
 * import { BrowserRouter, Routes, Route } from 'react-router-dom';
 * import DashboardPage from '@/pages/DashboardPage';
 *
 * function App() {
 *   return (
 *     <BrowserRouter>
 *       <Routes>
 *         <Route path="/dashboard/*" element={<DashboardPage />}>
 *           <Route path="overview" element={<OverviewPage />} />
 *           <Route path="settings" element={<SettingsPage />} />
 *         </Route>
 *       </Routes>
 *     </BrowserRouter>
 *   );
 * }
 * ```
 */
export default function DashboardPage() {
  const { t } = useTranslation(['common']);
  const location = useLocation();
  const { trackClick } = useOvhTracking();

  const header: HeadersProps = useDashboardHeader();
  const tabs = useDashboardTabs();
  const breadcrumbItems = useBreadcrumb({ rootLabel: t('common:home') });

  const activeTab = useMemo(
    () =>
      tabs.find((tab) => location.pathname === tab.to) ??
      tabs.find((tab) => tab.to && location.pathname.startsWith(tab.to)),
    [tabs, location.pathname],
  );

  return (
    <>
      <BaseLayout
        header={header}
        breadcrumb={<Breadcrumb items={breadcrumbItems} />}
        tabs={
          tabs.length > 0 ? (
            <OdsTabs>
              {tabs.map((tab) => (
                <NavLink
                  key={tab.name}
                  to={tab.to}
                  className="no-underline"
                  onClick={() => {
                    if (tab.trackingActions?.length) {
                      trackClick({ actions: tab.trackingActions });
                    }
                  }}
                >
                  <OdsTab isSelected={tab.name === activeTab?.name}>{tab.title}</OdsTab>
                </NavLink>
              ))}
            </OdsTabs>
          ) : undefined
        }
      />
      <Suspense fallback={null}>
        <Outlet />
      </Suspense>
    </>
  );
}
