import { lazy } from 'react';
import { Route } from 'react-router-dom';
import { ErrorBoundary } from '@/pages/Layout';
import ContainerListingPage from '@/pages/containers/Listing.page';
import UserListingPage from '@/pages/users/Listing.page';
import { COLD_ARCHIVE_TRACKING } from './tracking.constants';

export const ROUTE_PATHS = {
  ROOT: '/pci/projects/:projectId/storages/cold-archive',
  STORAGES: '',
  USER_LIST: 'users',
  MANAGE_CONTAINER: 'manage',
  DELETE_CONTAINER: 'delete-container/:archiveName',
  ADD_USER_CONTAINER: 'add-user/:archiveName',
  ONBOARDING: 'onboarding',
  RESTORE_CONTAINER: 'restore/:archiveName',
  EDIT_RETENTION: 'edit-retention/:archiveName',
  FLUSH_ARCHIVE: 'flush-archive/:archiveName',
  CONTAINER_LISTING: '',
  NEW_CONTAINER: 'new',
  USERS_LISTING: 'users',
  USER_CREATE: 'new',
  USER_DELETE: ':userId/delete',
  USER_IMPORT_POLICY: 'import-policy',
  USER_R_CLONE_DOWNLOAD: 'rclone/download',
  ARCHIVE_CONTAINER: 'archive/:archiveName',
};

const LayoutPage = lazy(() => import('@/pages/Layout'));
const StoragePage = lazy(() => import('@/pages/Archive.page'));

const NewContainerPage = lazy(() => import('@/pages/containers/new/New.page'));
const ManageContainerPage = lazy(() =>
  import('@/pages/containers/manage/Manage.page'),
);
const DeleteContainerPage = lazy(() =>
  import('@/pages/containers/delete/Delete.page'),
);
const AddUserContainerPage = lazy(() =>
  import('@/pages/containers/add-user/AddUser.page'),
);
const RestoreContainerPage = lazy(() =>
  import('@/pages/containers/restore/Restore.page'),
);
const EditRetentionPage = lazy(() =>
  import('@/pages/containers/edit-retention/EditRetention.page'),
);
const FlushArchivePage = lazy(() =>
  import('@/pages/containers/flush-archive/FlushArchive.page'),
);

const OnboardingPage = lazy(() => import('@/pages/onboarding/Onboarding.page'));
const ArchivePage = lazy(() =>
  import('@/pages/containers/archive/Archive.page'),
);

const UserCreationPage = lazy(() => import('@/pages/users/create/Create.page'));
const UserDeletionPage = lazy(() => import('@/pages/users/delete/Delete.page'));
const UserImportPolicyPage = lazy(() =>
  import('@/pages/users/import-policy/ImportPolicy.page'),
);
const UserRCloneDownloadPage = lazy(() =>
  import('@/pages/users/rclone-download/RCloneDownload.page'),
);

export default (
  <Route
    id="root"
    path={ROUTE_PATHS.ROOT}
    Component={LayoutPage}
    errorElement={<ErrorBoundary />}
  >
    <Route path="notFound" element={<>Page not found</>}></Route>
    <Route path={ROUTE_PATHS.ONBOARDING} Component={OnboardingPage} />
    <Route
      id={COLD_ARCHIVE_TRACKING.CONTAINERS.ADD_CONTAINER}
      path={ROUTE_PATHS.NEW_CONTAINER}
      Component={NewContainerPage}
    />
    <Route path={ROUTE_PATHS.STORAGES} Component={StoragePage}>
      <Route
        id={COLD_ARCHIVE_TRACKING.CONTAINERS.MAIN}
        path={ROUTE_PATHS.CONTAINER_LISTING}
        Component={ContainerListingPage}
      >
        <Route
          id={`${COLD_ARCHIVE_TRACKING.CONTAINERS.MAIN}::${COLD_ARCHIVE_TRACKING.CONTAINERS.MANAGE_CONTAINER}`}
          path={ROUTE_PATHS.MANAGE_CONTAINER}
          Component={ManageContainerPage}
        />
        <Route
          id={`${COLD_ARCHIVE_TRACKING.CONTAINERS.MAIN}::${COLD_ARCHIVE_TRACKING.CONTAINERS.DELETE_CONTAINER}`}
          path={ROUTE_PATHS.DELETE_CONTAINER}
          Component={DeleteContainerPage}
        />
        <Route
          id={`${COLD_ARCHIVE_TRACKING.CONTAINERS.MAIN}::${COLD_ARCHIVE_TRACKING.CONTAINERS.ADD_USER}`}
          path={ROUTE_PATHS.ADD_USER_CONTAINER}
          Component={AddUserContainerPage}
        />
        <Route
          id={`${COLD_ARCHIVE_TRACKING.CONTAINERS.MAIN}::${COLD_ARCHIVE_TRACKING.CONTAINERS.RESTORE}`}
          path={ROUTE_PATHS.RESTORE_CONTAINER}
          Component={RestoreContainerPage}
        />
        <Route
          id={`${COLD_ARCHIVE_TRACKING.CONTAINERS.MAIN}::${COLD_ARCHIVE_TRACKING.CONTAINERS.ARCHIVE}`}
          path={ROUTE_PATHS.ARCHIVE_CONTAINER}
          Component={ArchivePage}
        />
        <Route
          id={`${COLD_ARCHIVE_TRACKING.CONTAINERS.MAIN}::${COLD_ARCHIVE_TRACKING.CONTAINERS.EDIT_RETENTION}`}
          path={ROUTE_PATHS.EDIT_RETENTION}
          Component={EditRetentionPage}
        />
        <Route
          id={`${COLD_ARCHIVE_TRACKING.CONTAINERS.MAIN}::${COLD_ARCHIVE_TRACKING.CONTAINERS.FLUSH_CONTAINER}`}
          path={ROUTE_PATHS.FLUSH_ARCHIVE}
          Component={FlushArchivePage}
        />
      </Route>

      <Route
        id={COLD_ARCHIVE_TRACKING.USER.MAIN}
        path={ROUTE_PATHS.USERS_LISTING}
        Component={UserListingPage}
      >
        <Route
          id={`${COLD_ARCHIVE_TRACKING.USER.MAIN}::${COLD_ARCHIVE_TRACKING.USER.ADD_USER}`}
          path={ROUTE_PATHS.USER_CREATE}
          Component={UserCreationPage}
        />
        <Route
          id={`${COLD_ARCHIVE_TRACKING.USER.MAIN}::${COLD_ARCHIVE_TRACKING.USER.ACTIONS.DELETE_POLICY}`}
          path={ROUTE_PATHS.USER_DELETE}
          Component={UserDeletionPage}
        />
        <Route
          id={`${COLD_ARCHIVE_TRACKING.USER.MAIN}::${COLD_ARCHIVE_TRACKING.USER.ACTIONS.IMPORT_POLICY}`}
          path={ROUTE_PATHS.USER_IMPORT_POLICY}
          Component={UserImportPolicyPage}
        />
        <Route
          id={`${COLD_ARCHIVE_TRACKING.USER.MAIN}::${COLD_ARCHIVE_TRACKING.USER.ACTIONS.DOWNLOAD_RCLONE}`}
          path={ROUTE_PATHS.USER_R_CLONE_DOWNLOAD}
          Component={UserRCloneDownloadPage}
        />
      </Route>
    </Route>
  </Route>
);
