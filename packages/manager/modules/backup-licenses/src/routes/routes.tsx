import React from 'react';

import { Route } from 'react-router-dom';

import { PageType } from '@ovh-ux/manager-react-shell-client';

import { subRoutes } from './routes.constants';

const MainLayout = React.lazy(() => import('../pages/MainLayout.component'));
const OnboardingGuardPage = React.lazy(() => import('@/pages/onboarding/OnboardingGuard.page'));

export default (
  <>
    <Route path="" Component={MainLayout}></Route>
    <Route
      path={subRoutes.onboarding}
      Component={OnboardingGuardPage}
      handle={{
        tracking: { pageName: 'onboarding', pageType: PageType.onboarding },
      }}
    />
  </>
);
