import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

export const ROUTE_PATHS = {
  ROOT: '/pci/projects/:projectId/storages/cold-archive',
  STORAGES: '',
  USER_LIST: 'users',
  MANAGE_CONTAINER: 'manage',
  DELETE_CONTAINER: 'delete-container/:archiveName',
};

const LayoutPage = lazy(() => import('@/pages/Layout'));
const StoragePage = lazy(() => import('@/pages/cold-archive/Archive.page'));
const ListingContainerPage = lazy(() =>
  import('@/pages/cold-archive/container/Listing.page'),
);
const ManageContainerPage = lazy(() =>
  import('@/pages/cold-archive/container/manage/Manage.page'),
);
const DeleteContainerPage = lazy(() =>
  import('@/pages/cold-archive/container/delete/Delete.page'),
);

const RoutesComponent = () => (
  <Routes>
    <Route id="root" path={ROUTE_PATHS.ROOT} Component={LayoutPage}>
      <Route path={ROUTE_PATHS.STORAGES} Component={StoragePage}>
        <Route path={ROUTE_PATHS.STORAGES} Component={ListingContainerPage}>
          <Route
            path={ROUTE_PATHS.MANAGE_CONTAINER}
            Component={ManageContainerPage}
          />
          <Route
            path={ROUTE_PATHS.DELETE_CONTAINER}
            Component={DeleteContainerPage}
          />
        </Route>
      </Route>
    </Route>
    <Route path="" element={<>Page not found</>}></Route>
  </Routes>
);

export default RoutesComponent;
