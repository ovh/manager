import { ErrorBoundary } from '@ovh-ux/manager-react-components';
import React from 'react';
import { PageType } from '@ovh-ux/manager-react-shell-client';
import { Route } from 'react-router-dom';
import NotFound from '@/pages/404';
import { urls } from '@/routes/routes.constant';
import AllDom from '@/pages/dashboard/allDom/AllDom';

const LayoutPage = React.lazy(() => import('@/pages/layout'));
const DashboardPage = React.lazy(() => import('@/pages/dashboard/Dashboard'));
const DashboardDomainPage = React.lazy(() =>
  import('@/pages/dashboard/domain/Domain'),
);
const DashboardDnsPage = React.lazy(() => import('@/pages/dashboard/dns/Dns'));
const TrackPage = React.lazy(() => import('@/pages/tracking/Tracking'));
const ActionPage = React.lazy(() => import('@/pages/update/Update'));

export default (
  <Route
    path={urls.root}
    Component={LayoutPage}
    id="root"
    errorElement={
      <ErrorBoundary
        redirectionApp="web-ongoing-operations-backup"
        isPreloaderHide={true}
        isRouteShellSync={true}
      />
    }
  >
    <Route path={urls.root} Component={DashboardPage}>
      <Route
        id="dashboard.domain"
        path={urls.domain}
        Component={DashboardDomainPage}
        handle={{
          tracking: {
            pageName: 'domain',
            pageType: PageType.dashboard,
          },
        }}
      />
      <Route
        id="dashboard.dns"
        path={urls.dns}
        Component={DashboardDnsPage}
        handle={{
          tracking: {
            pageName: 'dns',
            pageType: PageType.dashboard,
          },
        }}
      />
      <Route
        id="dashboard.alldom"
        path={urls.allDom}
        Component={AllDom}
        handle={{
          tracking: {
            pageName: 'allDom',
            pageType: PageType.dashboard,
          },
        }}
      />
    </Route>
    <Route
      id="track"
      path={urls.track}
      Component={TrackPage}
      handle={{
        tracking: {
          pageName: 'tracking_transfert',
          pageType: PageType.dashboard,
        },
      }}
    />
    <Route
      id="update"
      path={urls.update}
      Component={ActionPage}
      handle={{
        tracking: {
          pageName: 'update_operation',
          pageType: PageType.dashboard,
        },
      }}
    />
    <Route path="*" element={<NotFound />} />
  </Route>
);
