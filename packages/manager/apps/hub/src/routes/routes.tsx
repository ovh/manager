import React from 'react';

import { Route } from 'react-router-dom';

import { ErrorBoundary } from '@ovh-ux/manager-react-components';
import { PageType } from '@ovh-ux/manager-react-shell-client';

import NotFound from '@/pages/404';

const LayoutPage = React.lazy(() => import('@/pages/layout'));
const DashboardPage = React.lazy(() => import('@/pages/dashboard/dashboard'));
const RoadmapChangelogPage = React.lazy(() => import('@/pages/changelog/Changelog'));

export default (
  <Route
    path={'/'}
    Component={LayoutPage}
    id={'root'}
    errorElement={
      <ErrorBoundary redirectionApp="hub-backup" isPreloaderHide={true} isRouteShellSync={true} />
    }
  >
    <Route
      path={''}
      Component={DashboardPage}
      handle={{
        tracking: {
          pageName: 'dashboard',
          pageType: PageType.dashboard,
        },
      }}
    />
    <Route
      path={'roadmap-changelog'}
      Component={RoadmapChangelogPage}
      handle={{
        tracking: {
          pageName: 'roadmap-changelog',
          pageType: PageType.onboarding,
        },
      }}
    />
    <Route path={'*'} element={<NotFound />} />
  </Route>
);
