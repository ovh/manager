import { lazy } from 'react';
import { Navigate, Route } from 'react-router-dom';
import { ErrorBoundary } from './pages/ErrorBoundary';

export const ROUTE_PATHS = {
  ROOT: '/pci/projects/:projectId/octavia-load-balancer',
  LISTING: 'load-balancers',
  DETAIL: ':region/:loadBalancerId',
  GENERAL_INFORMATION: 'general-information',
  EDIT_NAME_LOAD_BALANCER: 'edit-name',
  LISTENERS: 'listeners',
  LISTENERS_LIST: 'list',
  LISTENER_DELETE: ':listenerId/delete',
  LISTENER_CREATE: 'create',
  LISTENER_EDIT: ':listenerId/edit',
  L7: `:region/:loadBalancerId/listeners/:listenerId/l7`,
  L7_LIST: 'list',
  L7_CREATE: 'create',
  L7_DELETE: ':policyId/delete',
  L7_EDIT: ':policyId/edit',
  L7_RULES: ':region/:loadBalancerId/listeners/:listenerId/l7/:policyId/rules',
  L7_RULES_LIST: 'list',
  L7_RULES_CREATE: 'create',
  L7_RULES_DELETE: ':ruleId/delete',
  L7_RULES_EDIT: ':ruleId/edit',
  POOLS: 'pools',
  POOLS_CREATE: 'create',
  POOLS_EDIT_NAME: 'edit-name',
  POOLS_EDIT: ':poolId/edit',
  POOL_LIST: 'list',
  POOL_DELETE: 'delete',
  POOL_DETAIL: ':region/:loadBalancerId/pools/:poolId',
  POOL_MEMBERS: 'members',
  POOL_MEMBERS_LIST: 'list',
  POOL_MEMBERS_CREATE: 'create',
  POOL_MEMBERS_DELETE: ':memberId/delete',
  POOL_MEMBERS_EDIT: ':memberId/edit',
  POOL_HEALTH_MONITOR: 'health-monitor',
  POOL_HEALTH_MONITOR_CREATE: 'health-monitor/create',
  POOL_HEALTH_MONITOR_EDIT: 'health-monitor/edit',
  POOL_HEALTH_MONITOR_EDIT_NAME: 'edit-name',
  STATISTICS: 'statistics',
  CERTIFICATES: 'certificates',
  LOGS: 'logs',
  STREAMS: 'logs/streams',
  DELETE: ':region/:loadBalancerId/delete',
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
const ListenersListPage = lazy(() =>
  import('@/pages/detail/listeners/list/List.page'),
);
const L7PoliciesListPage = lazy(() =>
  import('@/pages/detail/listeners/l7/list/List.page'),
);
const L7PRulesListPage = lazy(() =>
  import('@/pages/detail/listeners/l7/rules/list/List.page'),
);
const L7PoliciesDeletePage = lazy(() =>
  import('@/pages/detail/listeners/l7/delete/Delete.page'),
);
const L7RulesDeletePage = lazy(() =>
  import('@/pages/detail/listeners/l7/rules/delete/Delete.page'),
);
const L7RulesEditPage = lazy(() =>
  import('@/pages/detail/listeners/l7/rules/edit/Edit.page'),
);
const L7PoliciesEditPage = lazy(() =>
  import('@/pages/detail/listeners/l7/edit/Edit.page'),
);
const L7PoliciesCreatePage = lazy(() =>
  import('@/pages/detail/listeners/l7/create/Create.page'),
);
const L7RulesCreatePage = lazy(() =>
  import('@/pages/detail/listeners/l7/rules/create/Create.page'),
);
const L7Page = lazy(() => import('@/pages/detail/listeners/l7/L7.page'));
const L7RulesPage = lazy(() =>
  import('@/pages/detail/listeners/l7/rules/L7Rules.page'),
);
const DeleteListenerPage = lazy(() =>
  import('@/pages/detail/listeners/delete/DeleteListener.page'),
);
const ListenersCreatePage = lazy(() =>
  import('@/pages/detail/listeners/create/Create.page'),
);
const ListenersEditPage = lazy(() =>
  import('@/pages/detail/listeners/edit/Edit.page'),
);

const PoolsPage = lazy(() => import('@/pages/detail/pools/Pools.page'));
const PoolsMembersListPage = lazy(() =>
  import('@/pages/detail/pools/detail/members/list/List.page'),
);
const PoolsMembersDeletePage = lazy(() =>
  import('@/pages/detail/pools/detail/members/delete/Delete.page'),
);
const PoolsMembersEditPage = lazy(() =>
  import('@/pages/detail/pools/detail/members/edit/Edit.page'),
);
const PoolsMembersCreatePage = lazy(() =>
  import('@/pages/detail/pools/detail/members/create/Create.page'),
);
const PoolsMembersPage = lazy(() =>
  import('@/pages/detail/pools/detail/members/Member.page'),
);
const PoolsCreatePage = lazy(() =>
  import('@/pages/detail/pools/create/PoolsCreate.page'),
);
const PoolsEditPage = lazy(() =>
  import('@/pages/detail/pools/edit/PoolsEdit.page'),
);
const PoolListPage = lazy(() => import('@/pages/detail/pools/list/List.page'));
const PoolDeletePage = lazy(() =>
  import('@/pages/detail/pools/delete/DeletePool.page'),
);
const PoolEditNamePage = lazy(() =>
  import('@/pages/detail/pools/detail/overview/edit-name/EditName.page'),
);
const PoolDetailPage = lazy(() =>
  import('@/pages/detail/pools/detail/Detail.page'),
);
const PoolOverviewPage = lazy(() =>
  import('@/pages/detail/pools/detail/overview/PoolOverview'),
);
const PoolHealthMonitorPage = lazy(() =>
  import('@/pages/detail/pools/detail/health-monitor/HealthMonitor'),
);
const HealthMonitorDeletePage = lazy(() =>
  import(
    '@/pages/detail/pools/detail/health-monitor/delete/DeleteHealthMonitor.page'
  ),
);
const HealthMonitorCreatePage = lazy(() =>
  import(
    '@/pages/detail/pools/detail/health-monitor/create/HealthMonitorCreate.page'
  ),
);
const HealthMonitorEditPage = lazy(() =>
  import(
    '@/pages/detail/pools/detail/health-monitor/edit/HealthMonitorEdit.page'
  ),
);
const HealthMonitorEditNamePage = lazy(() =>
  import(
    '@/pages/detail/pools/detail/health-monitor/rename/RenameHealthMonitor.page'
  ),
);

const StatisticsPage = lazy(() =>
  import('@/pages/detail/statistics/Statistics.page'),
);
const CertificatesPage = lazy(() =>
  import('@/pages/detail/certificates/Certificates.page'),
);
const LogsPage = lazy(() => import('@/pages/detail/log/Log.page'));
const StreamsPage = lazy(() => import('@/pages/detail/log/Streams.page'));
const DeletePage = lazy(() => import('@/pages/delete/Delete.page'));
const EditLoadBalancerNamePage = lazy(() =>
  import('@/pages/detail/edit/Edit.page'),
);

const Routes = (
  <Route
    id="root"
    path={ROUTE_PATHS.ROOT}
    Component={LayoutPage}
    errorElement={<ErrorBoundary />}
  >
    <Route path="" element={<Navigate to={ROUTE_PATHS.LISTING} replace />} />
    <Route path={ROUTE_PATHS.LISTING} Component={ListingPage}>
      <Route path={ROUTE_PATHS.DELETE} Component={DeletePage} />
    </Route>
    <Route
      path="create"
      Component={lazy(() => import('@/pages/create/Create.page'))}
    />
    <Route path="" element={<Navigate to={ROUTE_PATHS.LISTING} replace />} />
    <Route path={ROUTE_PATHS.L7} Component={L7Page}>
      <Route path="" element={<Navigate to={ROUTE_PATHS.L7_LIST} />} />
      <Route path={ROUTE_PATHS.L7_CREATE} Component={L7PoliciesCreatePage} />
      <Route path={ROUTE_PATHS.L7_EDIT} Component={L7PoliciesEditPage} />
      <Route path={ROUTE_PATHS.L7_LIST} Component={L7PoliciesListPage}>
        <Route path={ROUTE_PATHS.L7_DELETE} Component={L7PoliciesDeletePage} />
      </Route>
    </Route>
    <Route path={ROUTE_PATHS.L7_RULES} Component={L7RulesPage}>
      <Route path="" element={<Navigate to={ROUTE_PATHS.L7_RULES_LIST} />} />
      <Route path={ROUTE_PATHS.L7_RULES_CREATE} Component={L7RulesCreatePage} />
      <Route path={ROUTE_PATHS.L7_RULES_EDIT} Component={L7RulesEditPage} />
      <Route path={ROUTE_PATHS.L7_RULES_LIST} Component={L7PRulesListPage}>
        <Route
          path={ROUTE_PATHS.L7_RULES_DELETE}
          Component={L7RulesDeletePage}
        />
      </Route>
    </Route>
    <Route
      id="pools-detail"
      path={ROUTE_PATHS.POOL_DETAIL}
      Component={PoolDetailPage}
    >
      <Route
        path=""
        element={<Navigate to={ROUTE_PATHS.GENERAL_INFORMATION} />}
      />
      <Route path={ROUTE_PATHS.POOL_MEMBERS} Component={PoolsMembersPage}>
        <Route
          path=""
          element={<Navigate to={ROUTE_PATHS.POOL_MEMBERS_LIST} />}
        />
        <Route
          path={ROUTE_PATHS.POOL_MEMBERS_LIST}
          Component={PoolsMembersListPage}
        >
          <Route
            path={ROUTE_PATHS.POOL_MEMBERS_DELETE}
            Component={PoolsMembersDeletePage}
          />

          <Route
            path={ROUTE_PATHS.POOL_MEMBERS_EDIT}
            Component={PoolsMembersEditPage}
          />
          <Route
            path={ROUTE_PATHS.POOL_MEMBERS_CREATE}
            Component={PoolsMembersCreatePage}
          />
        </Route>
      </Route>
      <Route
        id="pools-detail-general-information"
        path={ROUTE_PATHS.GENERAL_INFORMATION}
        Component={PoolOverviewPage}
      >
        <Route
          id="pool-detail-delete"
          path={ROUTE_PATHS.POOL_DELETE}
          Component={PoolDeletePage}
        />
        <Route
          path={ROUTE_PATHS.POOLS_EDIT_NAME}
          Component={PoolEditNamePage}
        />
      </Route>
      <Route
        id="pools-detail-health-monitor"
        path={ROUTE_PATHS.POOL_HEALTH_MONITOR}
        Component={PoolHealthMonitorPage}
      >
        <Route
          id="health-monitor-delete"
          path={ROUTE_PATHS.POOL_DELETE}
          Component={HealthMonitorDeletePage}
        />
        <Route
          id="health-monitor-rename"
          path={ROUTE_PATHS.POOL_HEALTH_MONITOR_EDIT_NAME}
          Component={HealthMonitorEditNamePage}
        />
      </Route>
      <Route
        id="health-monitor-create"
        path={ROUTE_PATHS.POOL_HEALTH_MONITOR_CREATE}
        Component={HealthMonitorCreatePage}
      />
      <Route
        id="health-monitor-edit"
        path={ROUTE_PATHS.POOL_HEALTH_MONITOR_EDIT}
        Component={HealthMonitorEditPage}
      />
    </Route>
    <Route id="detail" path={ROUTE_PATHS.DETAIL} Component={DetailPage}>
      <Route
        path=""
        element={<Navigate to={ROUTE_PATHS.GENERAL_INFORMATION} />}
      />
      <Route
        id="detail-general-information"
        path={ROUTE_PATHS.GENERAL_INFORMATION}
        Component={OverviewPage}
      >
        <Route
          path={ROUTE_PATHS.EDIT_NAME_LOAD_BALANCER}
          Component={EditLoadBalancerNamePage}
        />
      </Route>
      <Route
        id="detail-listeners"
        path={ROUTE_PATHS.LISTENERS}
        Component={ListenersPage}
      >
        <Route path="" element={<Navigate to={ROUTE_PATHS.LISTENERS_LIST} />} />
        <Route
          id="listeners-list"
          path={ROUTE_PATHS.LISTENERS_LIST}
          Component={ListenersListPage}
        >
          <Route
            id="listener-delete"
            path={ROUTE_PATHS.LISTENER_DELETE}
            Component={DeleteListenerPage}
          />
        </Route>
        <Route
          id="listener-create"
          path={ROUTE_PATHS.LISTENER_CREATE}
          Component={ListenersCreatePage}
        />
        <Route
          id="listener-edit"
          path={ROUTE_PATHS.LISTENER_EDIT}
          Component={ListenersEditPage}
        />
      </Route>
      <Route id="detail-pools" path={ROUTE_PATHS.POOLS} Component={PoolsPage}>
        <Route path="" element={<Navigate to={ROUTE_PATHS.POOL_LIST} />} />
        <Route
          id="pool-list"
          path={ROUTE_PATHS.POOL_LIST}
          Component={PoolListPage}
        >
          <Route
            id="pool-delete"
            path={ROUTE_PATHS.POOL_DELETE}
            Component={PoolDeletePage}
          />
        </Route>
        <Route
          id="pools-create"
          path={ROUTE_PATHS.POOLS_CREATE}
          Component={PoolsCreatePage}
        />
        <Route
          id="pools-edit"
          path={ROUTE_PATHS.POOLS_EDIT}
          Component={PoolsEditPage}
        />
      </Route>

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
      <Route id="streams" path={ROUTE_PATHS.STREAMS} Component={StreamsPage} />
    </Route>
    <Route path="" element={<>Page not found</>}></Route>
  </Route>
);

export default Routes;
