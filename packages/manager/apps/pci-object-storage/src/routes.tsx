import { lazy } from 'react';
import { Route } from 'react-router-dom';
import { PageType } from '@ovh-ux/manager-react-shell-client';
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
  OBJECT_VERSIONS: `/pci/projects/:projectId/storages/objects/:storageId/:objectName/versions`,
  DELETE_OBJECT: `:objectName/delete`,
  ENABLE_VERSIONING: 'enableVersioning',
  ENABLE_ENCRYPTION: 'enableEncryption',
  REPLICATIONS: `/pci/projects/:projectId/storages/objects/:storageId/replications`,
  ADD_REPLICATION:
    '/pci/projects/:projectId/storages/objects/:storageId/replications/new',
  EDIT_REPLICATION: `/pci/projects/:projectId/storages/objects/:storageId/replications/:replicationId/edit`,
  DELETE_REPLICATION: `/pci/projects/:projectId/storages/objects/:storageId/replications/:replicationId/delete`,
  DOWNLOAD_RCLONE: 'rclone/download',
  ADD_USER_OBJECT: `:objectName/addUser`,
  EMPTY_USER_OBJECT: `:objectName/emptyUser`,
  DASHBOARD: '/pci/projects/:projectId/storages/objects/dashboard/:storageId',
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
const DashboardPage = lazy(() => import('@/pages/dashboard/Dashboard.page'));
const ObjectVersionsPage = lazy(() =>
  import('@/pages/objects/container/object/versions/ShowVersions.page'),
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

const ReplicationsListPage = lazy(() =>
  import('@/pages/objects/container/object/replication/ReplicationList.page'),
);

const AddReplicationPage = lazy(() =>
  import(
    '@/pages/objects/container/object/add-replication/ManageReplication.page'
  ),
);

const EditReplicationPage = lazy(() =>
  import(
    '@/pages/objects/container/object/add-replication/ManageReplication.page'
  ),
);

const DeleteReplicationPage = lazy(() =>
  import(
    '@/pages/objects/container/object/delete-replication/DeleteReplication.page'
  ),
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
    <Route
      path={ROUTE_PATHS.ONBOARDING}
      Component={OnboardingPage}
      handle={{
        tracking: {
          pageName: 'onboarding',
          pageType: PageType.onboarding,
        },
      }}
    />
    <Route
      path={ROUTE_PATHS.CONTAINER_NEW}
      Component={ContainerNewPage}
      handle={{
        tracking: {
          pageName: 'add_objects_storage_container',
          pageType: PageType.funnel,
        },
      }}
    />
    <Route path={ROUTE_PATHS.STORAGES} Component={StoragePage}>
      <Route
        path={ROUTE_PATHS.STORAGES}
        Component={ContainerListPage}
        handle={{
          tracking: {
            pageName: 'objects_storage_container_listing',
            pageType: PageType.listing,
          },
        }}
      >
        <Route
          path={ROUTE_PATHS.CONTAINER_DELETE}
          Component={DeleteContainerPage}
          handle={{
            tracking: {
              pageName: 'objects_storage_container_delete',
              pageType: PageType.popup,
            },
          }}
        />
        <Route
          path={ROUTE_PATHS.CONTAINER_ADD_USER}
          Component={AddUserToContainerPage}
          handle={{
            tracking: {
              pageName: 'objects_storage_container_add_user',
              pageType: PageType.popup,
            },
          }}
        />
        <Route
          path={ROUTE_PATHS.CONTAINER_EMPTY_USER}
          Component={EmptyUsersPage}
          handle={{
            tracking: {
              pageName: 'objects_storage_container_empty_user',
              pageType: PageType.listing,
            },
          }}
        />
      </Route>
      <Route
        path={ROUTE_PATHS.USER_LIST}
        Component={UserListPage}
        handle={{
          tracking: {
            pageName: 'objects_storage_container_users_listing',
            pageType: PageType.listing,
          },
        }}
      >
        <Route
          path={ROUTE_PATHS.USER_CREATE}
          Component={UserCreatePage}
          handle={{
            tracking: {
              pageName: 'objects_storage_container_users_create',
              pageType: PageType.popup,
            },
          }}
        />
        <Route
          path={ROUTE_PATHS.USER_IMPORT_POLICY}
          Component={ImportPolicyPage}
          handle={{
            tracking: {
              pageName: 'objects_storage_container_users_import_policy',
              pageType: PageType.popup,
            },
          }}
        />
        <Route
          path={ROUTE_PATHS.USER_DELETE}
          Component={DeleteUserPage}
          handle={{
            tracking: {
              pageName: 'objects_storage_container_users_delete',
              pageType: PageType.popup,
            },
          }}
        />
        <Route
          path={ROUTE_PATHS.DOWNLOAD_RCLONE}
          Component={DownloadRClonePage}
          handle={{
            tracking: {
              pageName: 'objects_storage_container_users_download_rclone',
              pageType: PageType.popup,
            },
          }}
        />
      </Route>
    </Route>
    <Route
      path={ROUTE_PATHS.OBJECTS}
      Component={ObjectPage}
      handle={{
        tracking: {
          pageName: 'objects_storage_container_listing_object',
          pageType: PageType.listing,
        },
      }}
    >
      <Route path={ROUTE_PATHS.ADD_USER_OBJECT} Component={AddUserObjectPage} />
      <Route path={ROUTE_PATHS.EMPTY_USER_OBJECT} Component={EmptyUsersPage} />
      <Route
        path={ROUTE_PATHS.DELETE_OBJECT}
        Component={DeleteObjectPage}
        handle={{
          tracking: {
            pageName: 'delete_object_versioning',
            pageType: PageType.popup,
          },
        }}
      />

      <Route
        path={ROUTE_PATHS.ADD_OBJECT}
        Component={AddObjectPage}
        handle={{
          tracking: {
            pageName: 'object_add_object',
            pageType: PageType.popup,
          },
        }}
      />
    </Route>
    <Route
      path={ROUTE_PATHS.OBJECT_VERSIONS}
      Component={ObjectVersionsPage}
      handle={{
        tracking: {
          pageName: 'object_versioning',
          pageType: PageType.listing,
        },
      }}
    >
      <Route
        path={ROUTE_PATHS.DELETE_OBJECT}
        Component={DeleteObjectPage}
        handle={{
          tracking: {
            pageName: 'delete_object_versioning',
            pageType: PageType.popup,
          },
        }}
      />
    </Route>
    <Route path={ROUTE_PATHS.REPLICATIONS} Component={ReplicationsListPage}>
      <Route
        path={ROUTE_PATHS.ENABLE_VERSIONING}
        Component={EnableVersioningPage}
        handle={{
          tracking: {
            pageName: 'object_activate_versioning',
            pageType: PageType.popup,
          },
        }}
      />
      <Route
        path={ROUTE_PATHS.DELETE_REPLICATION}
        Component={DeleteReplicationPage}
      />
    </Route>
    <Route path={ROUTE_PATHS.ADD_REPLICATION} Component={AddReplicationPage} />
    <Route
      path={ROUTE_PATHS.EDIT_REPLICATION}
      Component={EditReplicationPage}
    />
    <Route
      path={ROUTE_PATHS.DASHBOARD}
      Component={DashboardPage}
      handle={{
        tracking: {
          pageName: 'objects_storage_dashboard',
          pageType: PageType.dashboard,
        },
      }}
    >
      <Route
        path={ROUTE_PATHS.ENABLE_VERSIONING}
        Component={EnableVersioningPage}
        handle={{
          tracking: {
            pageName: 'object_activate_versioning',
            pageType: PageType.popup,
          },
        }}
      />

      <Route
        path={ROUTE_PATHS.ENABLE_ENCRYPTION}
        Component={EnableEncryptiongPage}
        handle={{
          tracking: {
            pageName: 'object_activate_encryption',
            pageType: PageType.popup,
          },
        }}
      />
    </Route>
    <Route path="" element={<>Page not found</>}></Route>
  </Route>
);
