import React from 'react';

import { Navigate, Route } from 'react-router-dom';

import { PageType } from '@ovh-ux/manager-react-shell-client';
import { ErrorBoundary } from '@ovh-ux/muk';

import NotFound from '@/pages/not-found/404.page';

import { redirectionApp, urls } from './Routes.constants';

const MainLayoutPage = React.lazy(() => import('@/pages/Main.layout'));
const RootPage = React.lazy(() => import('@/pages/root/Root.page'));
const ListingPage = React.lazy(() => import('@/pages/listing/Listing.page'));
const OnboardingPage = React.lazy(() => import('@/pages/onboarding/Onboarding.page'));
const OrderPage = React.lazy(() => import('@/pages/order/Order.page'));
const DashboardPage = React.lazy(() => import('@/pages/dashboard/Dashboard.page'));
const PartitionsListPage = React.lazy(
  () => import('@/pages/dashboard/partitions/PartitionsList.page'),
);
const CreatePartitionPage = React.lazy(
  () => import('@/pages/dashboard/partitions/create/CreatePartition.page'),
);
const DeletePartitionPage = React.lazy(
  () => import('@/pages/dashboard/partitions/delete/DeletePartition.page'),
);
const TaskTrackerPage = React.lazy(
  () => import('@/pages/dashboard/partitions/task-tracker/TaskTracker.page'),
);
const PartitionDetailPage = React.lazy(
  () => import('@/pages/dashboard/partition/PartitionDetail.page'),
);
const EditNamePage = React.lazy(() => import('@/pages/dashboard/edit-name/EditName.page'));
const EditDescriptionPage = React.lazy(
  () => import('@/pages/dashboard/partition/edit-description/EditDescription.page'),
);
const EditSizePage = React.lazy(
  () => import('@/pages/dashboard/partition/edit-size/EditSize.page'),
);
const AccessesPage = React.lazy(() => import('@/pages/dashboard/partition/accesses/Accesses.page'));
const CreateAccessPage = React.lazy(
  () => import('@/pages/dashboard/partition/accesses/create/CreateAccess.page'),
);
const DeleteAccessPage = React.lazy(
  () => import('@/pages/dashboard/partition/accesses/delete/DeleteAccess.page'),
);
const SnapshotsPage = React.lazy(
  () => import('@/pages/dashboard/partition/snapshots/Snapshots.page'),
);
const CreateSnapshotPage = React.lazy(
  () => import('@/pages/dashboard/partition/snapshots/create/CreateSnapshot.page'),
);
const DeleteSnapshotPage = React.lazy(
  () => import('@/pages/dashboard/partition/snapshots/delete/DeleteSnapshot.page'),
);
const ZfsOptionsPage = React.lazy(
  () => import('@/pages/dashboard/partitions/zfs-options/ZfsOptions.page'),
);

export default (
  <>
    {/* Root page that redirects based on services existence */}
    <Route path="/" element={<Navigate to={urls.root} replace />} />

    {/* Rooted application layout with conditional redirect */}
    <Route
      id="root"
      path={urls.root}
      Component={MainLayoutPage}
      errorElement={
        <ErrorBoundary
          isPreloaderHide={true}
          isRouteShellSync={true}
          redirectionApp={redirectionApp}
        />
      }
    >
      {/* Index route that checks services and redirects */}
      <Route index element={<RootPage />} />

      {/* Listing route */}
      <Route
        path={urls.listing}
        Component={ListingPage}
        handle={{
          tracking: {
            pageName: 'listing',
            pageType: PageType.listing,
          },
        }}
      />

      {/* Onboarding route */}
      <Route
        path={urls.onboarding}
        Component={OnboardingPage}
        handle={{
          tracking: {
            pageName: 'onboarding',
            pageType: PageType.onboarding,
          },
        }}
      />

      {/* Order route */}
      <Route
        path={urls.order}
        Component={OrderPage}
        handle={{
          tracking: {
            pageName: 'order',
            pageType: PageType.onboarding,
          },
        }}
      />

      {/* Dashboard route */}
      <Route
        path={urls.dashboard}
        Component={DashboardPage}
        handle={{
          tracking: {
            pageName: 'dashboard',
            pageType: PageType.dashboard,
          },
        }}
      >
        {/* Partitions list route */}
        <Route
          path="partitions"
          Component={PartitionsListPage}
          handle={{
            tracking: {
              pageName: 'partitions',
              pageType: PageType.dashboard,
            },
          }}
        >
          {/* Create partition route */}
          <Route
            path="create"
            Component={CreatePartitionPage}
            handle={{
              tracking: {
                pageName: 'create-partition',
                pageType: PageType.dashboard,
              },
            }}
          />
          {/* Delete partition route */}
          <Route
            path=":partitionName/delete"
            Component={DeletePartitionPage}
            handle={{
              tracking: {
                pageName: 'delete-partition',
                pageType: PageType.dashboard,
              },
            }}
          />
          {/* ZFS Options route */}
          <Route
            path=":partitionName/zfs-options"
            Component={ZfsOptionsPage}
            handle={{
              tracking: {
                pageName: 'zfs-options',
                pageType: PageType.dashboard,
              },
            }}
          />
          {/* Task tracker route */}
          <Route
            path="task-tracker"
            Component={TaskTrackerPage}
            handle={{
              tracking: {
                pageName: 'task-tracker',
                pageType: PageType.dashboard,
              },
            }}
          />
        </Route>

        {/* Edit name route */}
        <Route
          path="edit-name"
          Component={EditNamePage}
          handle={{
            tracking: {
              pageName: 'edit-name',
              pageType: PageType.dashboard,
            },
          }}
        />

        {/* Partition detail route */}
        <Route
          path="partition/:partitionName"
          Component={PartitionDetailPage}
          handle={{
            tracking: {
              pageName: 'partition-detail',
              pageType: PageType.dashboard,
            },
          }}
        >
          {/* Edit description route */}
          <Route
            path="edit-description"
            Component={EditDescriptionPage}
            handle={{
              tracking: {
                pageName: 'edit-description',
                pageType: PageType.dashboard,
              },
            }}
          />

          {/* Edit size route */}
          <Route
            path="edit-size"
            Component={EditSizePage}
            handle={{
              tracking: {
                pageName: 'edit-size',
                pageType: PageType.dashboard,
              },
            }}
          />

          {/* Accesses route */}
          <Route
            path="accesses"
            Component={AccessesPage}
            handle={{
              tracking: {
                pageName: 'accesses',
                pageType: PageType.dashboard,
              },
            }}
          >
            {/* Create access route */}
            <Route
              path="create"
              Component={CreateAccessPage}
              handle={{
                tracking: {
                  pageName: 'create-access',
                  pageType: PageType.dashboard,
                },
              }}
            />
            {/* Delete access route */}
            <Route
              path="delete/:ip"
              Component={DeleteAccessPage}
              handle={{
                tracking: {
                  pageName: 'delete-access',
                  pageType: PageType.dashboard,
                },
              }}
            />
          </Route>

          {/* Snapshots route */}
          <Route
            path="snapshots"
            Component={SnapshotsPage}
            handle={{
              tracking: {
                pageName: 'snapshots',
                pageType: PageType.dashboard,
              },
            }}
          >
            {/* Create snapshot route */}
            <Route
              path="create"
              Component={CreateSnapshotPage}
              handle={{
                tracking: {
                  pageName: 'create-snapshot',
                  pageType: PageType.dashboard,
                },
              }}
            />
            {/* Delete snapshot route */}
            <Route
              path="delete/:customSnapshotName"
              Component={DeleteSnapshotPage}
              handle={{
                tracking: {
                  pageName: 'delete-snapshot',
                  pageType: PageType.dashboard,
                },
              }}
            />
          </Route>
        </Route>
      </Route>

      {/* Catch-all 404 route inside the app */}
      <Route path="*" element={<NotFound />} />
    </Route>
  </>
);
