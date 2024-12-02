import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

export const ROUTE_PATHS = {
  ROOT: '/pci/projects/:projectId/storages/objects',
  ONBOARDING: 'onboarding',
  OBJECTS: '',
  CONTAINER_DELETE: 'delete',
  USER_LIST: 'users',
  USER_CREATE: 'new',
  USER_DELETE: ':userId/delete',
  USER_IMPORT_POLICY: 'import-policy',
};

const LayoutPage = lazy(() => import('@/pages/Layout'));
const OnboardingPage = lazy(() => import('@/pages/onboarding/Onboarding.page'));
const ObjectsPage = lazy(() => import('@/pages/objects/Objects.page'));
const ContainerListPage = lazy(() =>
  import('@/pages/objects/container/Listing.page'),
);
const DeleteContainerPage = lazy(() =>
  import('@/pages/objects/container/delete/Delete.page'),
);
const UserListPage = lazy(() =>
  import('@/pages/objects/container/users/Listing.page'),
);
const UserCreatePage = lazy(() =>
  import('@/pages/objects/container/users/Create.page'),
);
const DeleteUserPage = lazy(() =>
  import('@/pages/objects/container/users/delete/Delete.page'),
);
const ImportPolicyPage = lazy(() =>
  import('@/pages/objects/container/users/import-policy/ImportPolicy.page'),
);

const RoutesComponent = () => (
  <Routes>
    <Route id="root" path={ROUTE_PATHS.ROOT} Component={LayoutPage}>
      <Route path={ROUTE_PATHS.ONBOARDING} Component={OnboardingPage} />
      <Route path={ROUTE_PATHS.OBJECTS} Component={ObjectsPage}>
        <Route path={ROUTE_PATHS.OBJECTS} Component={ContainerListPage}>
          <Route
            path={ROUTE_PATHS.CONTAINER_DELETE}
            Component={DeleteContainerPage}
          />
        </Route>
        <Route path={ROUTE_PATHS.USER_LIST} Component={UserListPage}>
          <Route path={ROUTE_PATHS.USER_CREATE} Component={UserCreatePage} />
          <Route
            path={ROUTE_PATHS.USER_IMPORT_POLICY}
            Component={ImportPolicyPage}
          />
          <Route path={ROUTE_PATHS.USER_DELETE} Component={DeleteUserPage} />
        </Route>
      </Route>
    </Route>
    <Route path="" element={<>Page not found</>}></Route>
  </Routes>
);

export default RoutesComponent;
