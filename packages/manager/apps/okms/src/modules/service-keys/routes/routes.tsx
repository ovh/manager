import React from 'react';

import { Route } from 'react-router-dom';

import { PageType } from '@ovh-ux/manager-react-shell-client';

import { getRouteTracking } from '@/common/utils/tracking/tracking';

import { SERVICE_KEYS_ROUTES_URIS, SERVICE_KEYS_URL_PARAMS } from './routes.constants';

const Onboarding = React.lazy(
  () => import('@/modules/service-keys/pages/onboarding/Onboarding.page'),
);
const ServiceKeyList = React.lazy(
  () => import('@/modules/service-keys/pages/list/ServiceKeyList.page'),
);
const ServiceKeyDashboard = React.lazy(
  () => import('@/modules/service-keys/pages/detail/ServiceKey.page'),
);

export default (
  <Route path={SERVICE_KEYS_ROUTES_URIS.root} id={'service-keys-root'}>
    <Route path="" Component={Onboarding} handle={getRouteTracking([], PageType.onboarding)} />
    <Route path={SERVICE_KEYS_URL_PARAMS.okmsId}>
      <Route
        path=""
        Component={ServiceKeyList}
        handle={getRouteTracking(['service-key'], PageType.listing)}
      />
      <Route
        path={SERVICE_KEYS_URL_PARAMS.keyId}
        Component={ServiceKeyDashboard}
        handle={getRouteTracking(['service-key'], PageType.dashboard)}
      />
    </Route>
  </Route>
);
