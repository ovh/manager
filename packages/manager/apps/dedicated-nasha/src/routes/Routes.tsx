import React from 'react';
import { Route } from 'react-router-dom';
import { PageType } from '@ovh-ux/manager-react-shell-client';
import { ErrorBoundary } from '@ovh-ux/muk';

import NotFound from '@/pages/not-found/404.page';
import { redirectionApp, subRoutes, urls } from './Routes.constants';

// Lazy load pages for code splitting
const MainLayoutPage = React.lazy(() => import('@/pages/Main.layout'));
const RootRedirect = React.lazy(() => import('@/pages/Root.redirect'));
const OnboardingPage = React.lazy(
  () => import('@/pages/onboarding/Onboarding.page'),
);
const ListingPage = React.lazy(() => import('@/pages/listing/Listing.page'));
const OrderPage = React.lazy(() => import('@/pages/order/Order.page'));

// Dashboard pages
const DashboardLayout = React.lazy(
  () => import('@/pages/dashboard/Dashboard.layout'),
);
const DashboardPage = React.lazy(
  () => import('@/pages/dashboard/Dashboard.page'),
);
const EditNameModal = React.lazy(
  () => import('@/pages/dashboard/edit-name/EditName.modal'),
);

// Partitions pages
const PartitionsPage = React.lazy(
  () => import('@/pages/dashboard/partitions/Partitions.page'),
);
const PartitionCreateModal = React.lazy(
  () => import('@/pages/dashboard/partitions/create/PartitionCreate.modal'),
);
const PartitionDeleteModal = React.lazy(
  () => import('@/pages/dashboard/partitions/delete/PartitionDelete.modal'),
);
const PartitionEditSizeModal = React.lazy(
  () => import('@/pages/dashboard/partitions/edit-size/PartitionEditSize.modal'),
);
const PartitionZfsOptionsModal = React.lazy(
  () =>
    import('@/pages/dashboard/partitions/zfs-options/PartitionZfsOptions.modal'),
);

// Partition detail pages
const PartitionLayout = React.lazy(
  () => import('@/pages/dashboard/partition/Partition.layout'),
);
const PartitionPage = React.lazy(
  () => import('@/pages/dashboard/partition/Partition.page'),
);
const PartitionEditDescriptionModal = React.lazy(
  () =>
    import(
      '@/pages/dashboard/partition/edit-description/PartitionEditDescription.modal'
    ),
);
const PartitionDetailEditSizeModal = React.lazy(
  () =>
    import('@/pages/dashboard/partition/edit-size/PartitionEditSize.modal'),
);

// Accesses pages
const AccessesPage = React.lazy(
  () => import('@/pages/dashboard/partition/accesses/Accesses.page'),
);
const AccessDeleteModal = React.lazy(
  () =>
    import('@/pages/dashboard/partition/accesses/delete/AccessDelete.modal'),
);

// Snapshots pages
const SnapshotsPage = React.lazy(
  () => import('@/pages/dashboard/partition/snapshots/Snapshots.page'),
);
const SnapshotDeleteModal = React.lazy(
  () =>
    import('@/pages/dashboard/partition/snapshots/delete/SnapshotDelete.modal'),
);

export default (
  <>
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
      {/* Root redirect - checks for NASHA services and redirects accordingly */}
      <Route index Component={RootRedirect} />

      {/* Onboarding */}
      <Route
        path={subRoutes.onboarding}
        Component={OnboardingPage}
        handle={{
          tracking: { pageName: 'onboarding', pageType: PageType.onboarding },
        }}
      />

      {/* Listing */}
      <Route
        path={subRoutes.listing}
        Component={ListingPage}
        handle={{
          tracking: { pageName: 'listing', pageType: 'listing' },
        }}
      />

      {/* Order */}
      <Route
        path={subRoutes.order}
        Component={OrderPage}
        handle={{
          tracking: { pageName: 'order', pageType: 'funnel' },
        }}
      />

      {/* Dashboard */}
      <Route path={subRoutes.dashboard} Component={DashboardLayout}>
        {/* General Information */}
        <Route
          index
          Component={DashboardPage}
          handle={{
            tracking: { pageName: 'dashboard', pageType: 'dashboard' },
          }}
        />

        {/* Edit Name Modal */}
        <Route
          path="edit-name"
          Component={EditNameModal}
          handle={{
            tracking: { pageName: 'dashboard::edit-name', pageType: 'popup' },
          }}
        />

        {/* Partitions Tab */}
        <Route path="partitions">
          <Route
            index
            Component={PartitionsPage}
            handle={{
              tracking: {
                pageName: 'dashboard::nasha-partitions',
                pageType: 'listing',
              },
            }}
          />

          {/* Partition Create Modal */}
          <Route
            path="create"
            Component={PartitionCreateModal}
            handle={{
              tracking: {
                pageName: 'dashboard::nasha-partitions::create',
                pageType: 'popup',
              },
            }}
          />

          {/* Partition Actions from list */}
          <Route path=":partitionName">
            <Route
              path="delete"
              Component={PartitionDeleteModal}
              handle={{
                tracking: {
                  pageName: 'dashboard::nasha-partitions::delete',
                  pageType: 'popup',
                },
              }}
            />
            <Route
              path="edit-size"
              Component={PartitionEditSizeModal}
              handle={{
                tracking: {
                  pageName: 'dashboard::nasha-partitions::edit-size',
                  pageType: 'popup',
                },
              }}
            />
            <Route
              path="zfs-options"
              Component={PartitionZfsOptionsModal}
              handle={{
                tracking: {
                  pageName: 'dashboard::nasha-partitions::zfs-options',
                  pageType: 'popup',
                },
              }}
            />
          </Route>
        </Route>

        {/* Partition Detail */}
        <Route path="partition/:partitionName" Component={PartitionLayout}>
          {/* General Information */}
          <Route
            index
            Component={PartitionPage}
            handle={{
              tracking: {
                pageName: 'partition::dashboard',
                pageType: 'dashboard',
              },
            }}
          />

          {/* Edit Description Modal */}
          <Route
            path="edit-description"
            Component={PartitionEditDescriptionModal}
            handle={{
              tracking: {
                pageName: 'partition::dashboard::edit-description',
                pageType: 'popup',
              },
            }}
          />

          {/* Edit Size Modal */}
          <Route
            path="edit-size"
            Component={PartitionDetailEditSizeModal}
            handle={{
              tracking: {
                pageName: 'partition::dashboard::edit-size',
                pageType: 'popup',
              },
            }}
          />

          {/* Accesses Tab */}
          <Route path="accesses">
            <Route
              index
              Component={AccessesPage}
              handle={{
                tracking: { pageName: 'partition::acl', pageType: 'listing' },
              }}
            />
            <Route
              path=":ip/delete"
              Component={AccessDeleteModal}
              handle={{
                tracking: {
                  pageName: 'partition::acl::delete',
                  pageType: 'popup',
                },
              }}
            />
          </Route>

          {/* Snapshots Tab */}
          <Route path="snapshots">
            <Route
              index
              Component={SnapshotsPage}
              handle={{
                tracking: {
                  pageName: 'partition::snapshot-policy',
                  pageType: 'listing',
                },
              }}
            />
            <Route
              path=":customSnapshotName/delete"
              Component={SnapshotDeleteModal}
              handle={{
                tracking: {
                  pageName: 'partition::snapshot-policy::delete',
                  pageType: 'popup',
                },
              }}
            />
          </Route>
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Route>
  </>
);
