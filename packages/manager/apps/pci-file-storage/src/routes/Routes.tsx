import React from 'react';

import { Route } from 'react-router-dom';

import { PageType } from '@ovh-ux/manager-react-shell-client';
import { ErrorBoundary } from '@ovh-ux/muk';

import NotFound from '@/pages/not-found/NotFound.page';

import { redirectionApp, subRoutes, urls } from './Routes.constants';

const MainLayoutPage = React.lazy(() => import('@/pages/Main.layout'));
const OnboardingPage = React.lazy(() => import('@/pages/onboarding/Onboarding.page'));
const CreateSharePage = React.lazy(() => import('@/pages/create/CreateShare.page'));
const ShareListPage = React.lazy(() => import('@/pages/list/ShareList.page'));
const DashboardLayoutPage = React.lazy(() => import('@/pages/dashboard/Dashboard.layout'));
const GeneralInformationPage = React.lazy(
  () => import('@/pages/dashboard/GeneralInformation/GeneralInformation.page'),
);
const SnapshotsPage = React.lazy(() => import('@/pages/dashboard/Snapshots/Snapshots.page'));
const AclPage = React.lazy(() => import('@/pages/dashboard/Acl/Acl.page'));
const DeleteSharePage = React.lazy(() => import('@/pages/delete/DeleteShare.page'));

const getDeleteSubroute = () => (
  <>
    <Route index></Route>
    <Route
      path={subRoutes.shareDelete}
      Component={DeleteSharePage}
      handle={{
        tracking: {
          pageName: 'share-delete',
          pageType: PageType.popup,
        },
      }}
    />
  </>
);

const Routes = (
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
      <Route
        path={subRoutes.onboarding}
        Component={OnboardingPage}
        handle={{
          tracking: { pageName: 'onboarding', pageType: PageType.onboarding },
        }}
      />
      <Route
        path={subRoutes.create}
        Component={CreateSharePage}
        handle={{
          tracking: { pageName: 'new', pageType: PageType.funnel },
        }}
      />
      <Route
        path={subRoutes.list}
        Component={ShareListPage}
        handle={{
          tracking: { pageName: 'list', pageType: PageType.listing },
        }}
      >
        {getDeleteSubroute()}
      </Route>
      <Route
        path={subRoutes.shareDetail}
        Component={DashboardLayoutPage}
        handle={{
          tracking: { pageName: 'dashboard', pageType: PageType.dashboard },
        }}
      >
        <Route
          Component={GeneralInformationPage}
          handle={{
            tracking: {
              pageName: 'general-information',
              pageType: PageType.dashboard,
            },
          }}
        >
          {getDeleteSubroute()}
        </Route>
        <Route
          path={subRoutes.shareSnapshots}
          Component={SnapshotsPage}
          handle={{
            tracking: {
              pageName: 'snapshots',
              pageType: PageType.dashboard,
            },
          }}
        />
        <Route
          path={subRoutes.shareAcl}
          Component={AclPage}
          handle={{
            tracking: {
              pageName: 'acl',
              pageType: PageType.dashboard,
            },
          }}
        />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Route>
  </>
);
export default Routes;
