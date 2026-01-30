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

export const Routes = (
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
          tracking: { pageName: 'list', pageType: PageType.dashboard },
        }}
      />
      <Route path="*" element={<NotFound />} />
    </Route>
  </>
);
