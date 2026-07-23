import React from 'react';

import { Route } from 'react-router-dom';

import { PageType } from '@ovh-ux/manager-react-shell-client';

import { subRoutes } from './routes.constants';

const OnboardingGuardPage = React.lazy(() => import('@/pages/onboarding/OnboardingGuard.page'));
const OrderPage = React.lazy(() => import('@/pages/order/Order.page'));

export default (
  <>
    <Route
      path={subRoutes.onboarding}
      Component={OnboardingGuardPage}
      handle={{
        tracking: { pageName: 'onboarding', pageType: PageType.onboarding },
      }}
    />
    <Route
      path={subRoutes.order}
      Component={OrderPage}
      handle={{
        tracking: { pageName: 'order', pageType: PageType.funnel },
      }}
    />
  </>
);
