import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

export const ROUTE_PATHS = {
  ROOT: '/pci/projects/:projectId/storages/objects',
  OBJECTS: '',
  USER_LIST: 'users',
};

const LayoutPage = lazy(() => import('@/pages/Layout'));
const ObjectsPage = lazy(() => import('@/pages/objects/Objects.page'));
const ContainerListPage = lazy(() =>
  import('@/pages/objects/container/Listing.page'),
);
const UserListPage = lazy(() =>
  import('@/pages/objects/container/users/Listing.page'),
);

const RoutesComponent = () => (
  <Routes>
    <Route id="root" path={ROUTE_PATHS.ROOT} Component={LayoutPage}>
      <Route path={ROUTE_PATHS.OBJECTS} Component={ObjectsPage}>
        <Route path={ROUTE_PATHS.OBJECTS} Component={ContainerListPage} />
        <Route path={ROUTE_PATHS.USER_LIST} Component={UserListPage} />
      </Route>
    </Route>
    <Route path="" element={<>Page not found</>}></Route>
  </Routes>
);

export default RoutesComponent;
