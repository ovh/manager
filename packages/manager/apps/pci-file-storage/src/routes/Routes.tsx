import React from 'react';

import { Navigate, Route } from 'react-router-dom';

import { PageType } from '@ovh-ux/manager-react-shell-client';
import { ErrorBoundary } from '@ovh-ux/muk';

import NotFound from '@/pages/not-found/NotFound.page';

import { redirectionApp, subRoutes, urls } from './Routes.constants';

const MainLayoutPage = React.lazy(() => import('@/pages/Main.layout'));
const OnboardingPage = React.lazy(() => import('@/pages/onboarding/Onboarding.page'));
const CreateSharePage = React.lazy(() => import('@/pages/create/CreateShare.page'));

export const Routes = (
  <>
    <Route path="/" element={<Navigate to={urls.onboarding} replace />} />
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
      <Route path="" element={<Navigate to={subRoutes.onboarding} replace />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  </>
);
