import { getLogsRoute } from '@ovh-ux/logs-to-customer';
import { ErrorBoundary } from '@ovh-ux/manager-react-components';
import { PageType } from '@ovh-ux/manager-react-shell-client';
import { lazy } from 'react';
import { Navigate, Route } from 'react-router-dom';
import { urls } from '@/routes/routes.constant';

const LayoutPage = lazy(() => import('@/pages/layout'));
const DashboardPage = lazy(() => import('@/pages/dashboard'));
const LogsPage = lazy(() => import('@/pages/dashboard/logs/Logs.page'));

export default (
  <Route
    path={urls.root}
    id="root"
    Component={LayoutPage}
    errorElement={
      <ErrorBoundary
        isPreloaderHide={true}
        isRouteShellSync={true}
        redirectionApp="hpc-vmware-vsphere"
      />
    }
  >
    <Route
      index
      element={<Navigate to={`${urls.dashboard}/${urls.logs}`} replace />}
    />
    <Route path={urls.dashboard} Component={DashboardPage} id="dashboard">
      <Route
        path={urls.logs}
        id="logs"
        Component={LogsPage}
        handle={{
          tracking: {
            pageName: 'logs',
            pageType: PageType.dashboard,
          },
        }}
      >
        {getLogsRoute()}
      </Route>
    </Route>
  </Route>
);
