import { lazy } from 'react';
import { Route } from 'react-router-dom';
import { ErrorBoundary } from '@/pages/ErrorBoundary';

export const ROUTE_PATHS = {
  ROOT: '/pci/projects/:projectId/storages/objects',
  ONBOARDING: 'onboarding',
  CONTAINER_DELETE: 'delete',
  CONTAINER_ADD_USER: 'addUser',
  CONTAINER_EMPTY_USER: 'emptyUser',
  STORAGES: '',
  CONTAINER_NEW: 'new',
  USER_LIST: 'users',
  USER_CREATE: 'new',
  USER_DELETE: ':userId/delete',
  USER_IMPORT_POLICY: 'import-policy',
  OBJECTS: `/pci/projects/:projectId/storages/objects/:storageId`,
  ADD_OBJECT: 'new',
  DELETE_OBJECT: `:objectName/delete`,
  ENABLE_VERSIONING: 'enableVersioning',
  ENABLE_ENCRYPTION: 'enableEncryption',
  DOWNLOAD_RCLONE: 'rclone/download',
  ADD_USER_OBJECT: `:objectName/addUser`,
  EMPTY_USER_OBJECT: `:objectName/emptyUser`,
};

const LayoutPage = lazy(() => import('@/pages/Layout'));
const OnboardingPage = lazy(() => import('@/pages/onboarding/Onboarding.page'));
const StoragePage = lazy(() => import('@/pages/objects/Storage.page'));
const ObjectPage = lazy(() =>
  import('@/pages/objects/container/object/show/Show.page'),
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
const AddUserToContainerPage = lazy(() =>
  import('@/pages/objects/container/add-user/AddUser.page'),
);
const EmptyUsersPage = lazy(() =>
  import('@/pages/objects/container/empty-users/EmptyUsers.page'),
);
const UserListPage = lazy(() =>
  import('@/pages/objects/container/users/Listing.page'),
);
const UserCreatePage = lazy(() =>
  import('@/pages/objects/container/users/create/Create.page'),
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
const EnableEncryptiongPage = lazy(() =>
  import('@/pages/objects/container/enable-encryption/EnableEncryption.page'),
);

const DownloadRClonePage = lazy(() =>
  import('@/pages/objects/container/users/rclone-download/RCloneDownload.page'),
);

const AddObjectPage = lazy(() =>
  import('@/pages/objects/container/object/add/AddObject.page'),
);

export default (
  <Route
    id="root"
    path={ROUTE_PATHS.ROOT}
    Component={LayoutPage}
    errorElement={<ErrorBoundary />}
  >
    <Route path={ROUTE_PATHS.ONBOARDING} Component={OnboardingPage} />
    <Route path={ROUTE_PATHS.CONTAINER_NEW} Component={ContainerNewPage} />
    <Route path={ROUTE_PATHS.STORAGES} Component={StoragePage}>
      <Route path={ROUTE_PATHS.STORAGES} Component={ContainerListPage}>
        <Route
          path={ROUTE_PATHS.CONTAINER_DELETE}
          Component={DeleteContainerPage}
        />
        <Route
          path={ROUTE_PATHS.CONTAINER_ADD_USER}
          Component={AddUserToContainerPage}
        />
        <Route
          path={ROUTE_PATHS.CONTAINER_EMPTY_USER}
          Component={EmptyUsersPage}
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
      <Route path={ROUTE_PATHS.ADD_USER_OBJECT} Component={AddUserObjectPage} />
      <Route path={ROUTE_PATHS.EMPTY_USER_OBJECT} Component={EmptyUsersPage} />
      <Route path={ROUTE_PATHS.DELETE_OBJECT} Component={DeleteObjectPage} />
      <Route
        path={ROUTE_PATHS.ENABLE_VERSIONING}
        Component={EnableVersioningPage}
      />
      <Route
        path={ROUTE_PATHS.ENABLE_ENCRYPTION}
        Component={EnableEncryptiongPage}
      />
      <Route path={ROUTE_PATHS.ADD_OBJECT} Component={AddObjectPage} />
    </Route>
    <Route path="" element={<>Page not found</>}></Route>
  </Route>
);
