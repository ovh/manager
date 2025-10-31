import React from 'react';

import { Navigate, Route } from 'react-router-dom';

import { PageType } from '@ovh-ux/manager-react-shell-client';
import { ErrorBoundary } from '@/components/debug/ErrorBoundary.component';

import { urls } from './Routes.constants';

const MainLayoutPage = React.lazy(() => import('@/pages/Main.layout'));
const RootPage = React.lazy(() => import('@/pages/root/Root.page'));
const OnboardingPage = React.lazy(() => import('@/pages/onboarding/Onboarding.page'));
const ListingPage = React.lazy(() => import('@/pages/listing/Listing.page'));
const DashboardPage = React.lazy(() => import('@/pages/dashboard/Dashboard.page'));
const PartitionsPage = React.lazy(() => import('@/pages/dashboard/partitions/Partitions.page'));
const PartitionPage = React.lazy(() => import('@/pages/dashboard/partitions/partition/Partition.page'));
const SnapshotsPage = React.lazy(() => import('@/pages/dashboard/partitions/partition/snapshots/Snapshots.page'));
const AccessesPage = React.lazy(() => import('@/pages/dashboard/partitions/partition/accesses/Accesses.page'));

export default (
  <>
    {/* Rooted application layout - React Router in iframe sees relative paths */}
    {/* Container handles /bmc-nasha prefix, React Router only sees paths after that */}
    <Route
      id="root"
      path={urls.root}
      Component={MainLayoutPage}
      errorElement={<ErrorBoundary />}
    >
      {/* Smart redirect root - checks for services */}
      <Route
        index
        Component={RootPage}
        handle={{
          tracking: {
            pageName: 'root',
            pageType: PageType.listing,
          },
        }}
      />

      {/* Onboarding route */}
      <Route
        path="onboarding"
        Component={OnboardingPage}
        handle={{
          tracking: {
            pageName: 'onboarding',
            pageType: PageType.onboarding,
          },
        }}
      />

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

      {/* Dashboard route - must be after listing to avoid conflicts */}
      <Route
        path=":serviceName/*"
        Component={DashboardPage}
        handle={{
          tracking: {
            pageName: 'dashboard',
            pageType: PageType.listing,
          },
        }}
      >
        {/* Direct partition route - matches AngularJS /partition/:partitionName */}
        <Route
          path="partition/:partitionName/*"
          Component={PartitionPage}
          handle={{
            tracking: {
              pageName: 'partition-detail',
              pageType: PageType.listing,
            },
          }}
        >
          {/* Snapshots sub-route */}
          <Route
            path="snapshots"
            Component={SnapshotsPage}
            handle={{
              tracking: {
                pageName: 'snapshots',
                pageType: PageType.listing,
              },
            }}
          />
          {/* Accesses sub-route */}
          <Route
            path="accesses"
            Component={AccessesPage}
            handle={{
              tracking: {
                pageName: 'accesses',
                pageType: PageType.listing,
              },
            }}
          />
        </Route>

        {/* Partitions sub-route */}
        <Route
          path="partitions"
          Component={PartitionsPage}
          handle={{
            tracking: {
              pageName: 'partitions',
              pageType: PageType.listing,
            },
          }}
        >
          {/* Partition detail sub-route - matches AngularJS /partitions/:partitionName */}
          <Route
            path=":partitionName/*"
            Component={PartitionPage}
            handle={{
              tracking: {
                pageName: 'partition-detail',
                pageType: PageType.listing,
              },
            }}
          >
            {/* Snapshots sub-route */}
            <Route
              path="snapshots"
              Component={SnapshotsPage}
              handle={{
                tracking: {
                  pageName: 'snapshots',
                  pageType: PageType.listing,
                },
              }}
            />
            {/* Accesses sub-route */}
            <Route
              path="accesses"
              Component={AccessesPage}
              handle={{
                tracking: {
                  pageName: 'accesses',
                  pageType: PageType.listing,
                },
              }}
            />
          </Route>
        </Route>
      </Route>

      {/* Catch-all redirect to listing */}
      <Route path="*" element={<Navigate to="." replace />} />
    </Route>
  </>
);
