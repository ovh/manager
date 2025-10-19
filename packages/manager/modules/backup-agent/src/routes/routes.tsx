import React from 'react';

import { Route } from 'react-router-dom';

import { PageType } from '@ovh-ux/manager-react-shell-client';

import {subRoutes} from './Routes.constants';

const MainLayout = React.lazy(() => import('../pages/MainLayout.component'));

const ListingPage = React.lazy(() => import('../pages/listing/Listing.page'));

export default (
  <Route path="" Component={MainLayout}>
      <Route
        path={subRoutes.services}
        Component={ListingPage}
        handle={{
          tracking: {
            pageName: 'services',
            pageType: PageType.listing,
          },
        }}
      />
    <Route
      path={subRoutes.vaults}
      Component={ListingPage}
      handle={{
        tracking: {
          pageName: 'vaults',
          pageType: PageType.listing,
        },
      }}
    />
    <Route
      path={subRoutes.billing}
      Component={ListingPage}
      handle={{
        tracking: {
          pageName: 'listing',
          pageType: PageType.listing,
        },
      }}
    />
  </Route>
);
