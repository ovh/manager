import { Route, Routes } from 'react-router-dom';
import { lazy } from 'react';

enum RouteTracking {
  LISTING = 'registries',
  API_URL = 'api-url',
  CREDENTIALS = 'credentials',
  CREATE = 'create',
  DELETE = 'delete',
  UPDATE = 'update',
  ON_BOARDING = 'onboarding',
}

const ROUTE_PATHS = {
  ROOT: '/pci/projects/:projectId/private-registry',
  LISTING: '',
  API_URL: ':registryId/api-url',
  CREDENTIALS: ':registryId/credentials',
  CREATE: 'create',
  DELETE: 'delete',
  UPDATE: 'update',
  NEW: 'new',
  ON_BOARDING: 'onboarding',
  UPGRADE_PLAN: 'upgrade-plan',
};

const LayoutPage = lazy(() => import('@/pages/Layout'));
const ListPage = lazy(() => import('@/pages/list/List.page'));
const ApiUrlPage = lazy(() => import('@/pages/api-url/APIUrl.page'));
const CredentialsPage = lazy(() =>
  import('@/pages/credentials/Credentials.page'),
);
const DeletePage = lazy(() => import('@/pages/delete/Delete.page'));
const UpdatePage = lazy(() => import('@/pages/update/Update.page'));
const CreatePage = lazy(() => import('@/pages/create/Create.page'));
const OnBoardingPage = lazy(() => import('@/pages/onboarding/Onboarding.page'));
const UpgradePlanPage = lazy(() =>
  import('@/pages/upgrade-plan/UpgradePlan.page'),
);

const RoutesComponent = () => (
  <Routes>
    <Route id="root" path={ROUTE_PATHS.ROOT} Component={LayoutPage}>
      <Route
        id="listing"
        path={ROUTE_PATHS.LISTING}
        handle={{ tracking: RouteTracking.LISTING }}
        Component={ListPage}
      >
        <Route
          id="apiUrl"
          path={ROUTE_PATHS.API_URL}
          handle={{ tracking: RouteTracking.API_URL }}
          Component={ApiUrlPage}
        />
        <Route
          id="credentials"
          path={ROUTE_PATHS.CREDENTIALS}
          handle={{ tracking: RouteTracking.CREDENTIALS }}
          Component={CredentialsPage}
        />
        <Route
          id="delete"
          path={ROUTE_PATHS.DELETE}
          handle={{ tracking: RouteTracking.DELETE }}
          Component={DeletePage}
        />
        <Route
          id="update"
          path={ROUTE_PATHS.UPDATE}
          handle={{ tracking: RouteTracking.UPDATE }}
          Component={UpdatePage}
        />
      </Route>
      <Route
        id="create"
        path={ROUTE_PATHS.CREATE}
        handle={{ tracking: RouteTracking.CREATE }}
        Component={CreatePage}
      />
      <Route
        id="onBoarding"
        path={ROUTE_PATHS.ON_BOARDING}
        handle={{ tracking: RouteTracking.ON_BOARDING }}
        Component={OnBoardingPage}
      />
      <Route
        id="upgrade-plan"
        path={ROUTE_PATHS.UPGRADE_PLAN}
        Component={UpgradePlanPage}
      />
    </Route>
    <Route path="" element={<>Page not found</>}></Route>
  </Routes>
);

export default RoutesComponent;
