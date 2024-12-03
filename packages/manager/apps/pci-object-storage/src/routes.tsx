import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

export const ROUTE_PATHS = {
  ROOT: '/pci/projects/:projectId/storages/objects',
  ONBOARDING: 'onboarding',
  CONTAINER_DELETE: 'delete',
  STORAGES: '',
  CONTAINER_NEW: 'new',
  USER_LIST: 'users',
  USER_CREATE: 'new',
  USER_DELETE: ':userId/delete',
  USER_IMPORT_POLICY: 'import-policy',
  OBJECTS: `/pci/projects/:projectId/storages/objects/:storageId`,
  DELETE_OBJECT: `:objectName/delete`,
  ENABLE_VERSIONING: 'enableVersioning',
  DOWNLOAD_RCLONE: 'rclone/download',
  ADD_USER_OBJECT: `:objectName/addUser`,
};

const LayoutPage = lazy(() => import('@/pages/Layout'));
const OnboardingPage = lazy(() => import('@/pages/onboarding/Onboarding.page'));
const StoragePage = lazy(() => import('@/pages/objects/Storage.page'));
const ObjectPage = lazy(() =>
  import('@/pages/objects/container/object/Object.page'),
);
const DeleteObjectPage = lazy(() =>
  import('@/pages/objects/container/object/delete/Delete.page'),
);
const ContainerNewPage = lazy(() =>
  import('@/pages/objects/container/new/New.page'),
);
const ContainerListPage = lazy(() =>
  import('@/pages/objects/container/Listing.page'),
);
const DeleteContainerPage = lazy(() =>
  import('@/pages/objects/container/delete/Delete.page'),
);
const AddUserObjectPage = lazy(() =>
  import('@/pages/objects/container/object/add-user/AddUser.page'),
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
const EnableVersioningPage = lazy(() =>
  import('@/pages/objects/container/enable-versioning/EnableVersioning.page'),
);

const DownloadRClonePage = lazy(() =>
  import('@/pages/objects/container/users/rclone-download/RCloneDownload.page'),
);

const RoutesComponent = () => (
  <Routes>
    <Route id="root" path={ROUTE_PATHS.ROOT} Component={LayoutPage}>
      <Route path={ROUTE_PATHS.ONBOARDING} Component={OnboardingPage} />
      <Route path={ROUTE_PATHS.CONTAINER_NEW} Component={ContainerNewPage} />
      <Route path={ROUTE_PATHS.STORAGES} Component={StoragePage}>
        <Route path={ROUTE_PATHS.STORAGES} Component={ContainerListPage}>
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
          <Route
            path={ROUTE_PATHS.DOWNLOAD_RCLONE}
            Component={DownloadRClonePage}
          />
        </Route>
      </Route>
      <Route path={ROUTE_PATHS.OBJECTS} Component={ObjectPage}>
        <Route
          path={ROUTE_PATHS.ADD_USER_OBJECT}
          Component={AddUserObjectPage}
        />
        <Route path={ROUTE_PATHS.DELETE_OBJECT} Component={DeleteObjectPage} />
      </Route>
      <Route path="" element={<>Page not found</>}></Route>
    </Route>
    <Route path={ROUTE_PATHS.OBJECTS} Component={ObjectPage}>
      <Route path={ROUTE_PATHS.DELETE_OBJECT} Component={DeleteObjectPage} />
      <Route
        path={ROUTE_PATHS.ENABLE_VERSIONING}
        Component={EnableVersioningPage}
      />
    </Route>
  </Routes>
);

export default RoutesComponent;
