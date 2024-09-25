import { lazy } from 'react';
import { Navigate, Route } from 'react-router-dom';
import { ErrorBoundary } from './pages/ErrorBoundary';

export const ROUTE_PATHS = {
  ROOT: '/pci/projects/:projectId/octavia-load-balancer',
  LISTING: 'load-balancers',
  DETAIL: ':region/:loadBalancerId',
  GENERAL_INFORMATION: 'general-information',
  LISTENERS: 'listeners',
  POOLS: 'pools',
  STATISTICS: 'statistics',
  CERTIFICATES: 'certificates',
  LOGS: 'logs',
};

const LayoutPage = lazy(() => import('@/pages/Layout'));
const ListingPage = lazy(() => import('@/pages/listing/Listing.page'));
const DetailPage = lazy(() => import('@/pages/detail/Detail.page'));
const OverviewPage = lazy(() =>
  import('@/pages/detail/overview/Overview.page'),
);
const ListenersPage = lazy(() =>
  import('@/pages/detail/listeners/Listeners.page'),
);
const PoolsPage = lazy(() => import('@/pages/detail/pools/Pools.page'));
const StatisticsPage = lazy(() =>
  import('@/pages/detail/statistics/Statistics.page'),
);
const CertificatesPage = lazy(() =>
  import('@/pages/detail/certificates/Certificates.page'),
);
const LogsPage = lazy(() => import('@/pages/detail/logs/Logs.page'));

const Routes = (
  <Route
    id="root"
    path={ROUTE_PATHS.ROOT}
    Component={LayoutPage}
    errorElement={<ErrorBoundary />}
  >
    <Route path="" element={<Navigate to={ROUTE_PATHS.LISTING} replace />} />
    <Route id="listing" path={ROUTE_PATHS.LISTING} Component={ListingPage} />
    <Route id="detail" path={ROUTE_PATHS.DETAIL} Component={DetailPage}>
      <Route
        path=""
        element={<Navigate to={ROUTE_PATHS.GENERAL_INFORMATION} />}
      />
      <Route
        id="detail-general-information"
        path={ROUTE_PATHS.GENERAL_INFORMATION}
        Component={OverviewPage}
      />
      <Route
        id="detail-listeners"
        path={ROUTE_PATHS.LISTENERS}
        Component={ListenersPage}
      />
      <Route id="detail-pools" path={ROUTE_PATHS.POOLS} Component={PoolsPage} />
      <Route
        id="detail-statistics"
        path={ROUTE_PATHS.STATISTICS}
        Component={StatisticsPage}
      />
      <Route
        id="detail-certificates"
        path={ROUTE_PATHS.CERTIFICATES}
        Component={CertificatesPage}
      />
      <Route id="detail-logs" path={ROUTE_PATHS.LOGS} Component={LogsPage} />
    </Route>
    <Route path="" element={<>Page not found</>}></Route>
  </Route>
);

export default Routes;
