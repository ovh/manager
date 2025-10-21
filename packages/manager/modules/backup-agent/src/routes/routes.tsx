import React from 'react';

import { Route } from 'react-router-dom';

import { PageType } from '@ovh-ux/manager-react-shell-client';

import { subRoutes, urlParams } from './Routes.constants';

const MainLayout = React.lazy(() => import('../pages/MainLayout.component'));

const ListingPage = React.lazy(() => import('../pages/listing/Listing.page'));

const VaultListingPage = React.lazy(() => import('../pages/vaults/listing/Listing.page'));

const VaultDashboardPage = React.lazy(() => import('@/pages/vaults/dashboard/Dashboard.page'));

const VaultGeneralInformationPage = React.lazy(
  () => import('../pages/vaults/dashboard/general-information/GeneralInformation.page'),
);

export default (
  <>
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
      <Route path={subRoutes.vaults}>
        <Route
          path=""
          Component={VaultListingPage}
          handle={{
            tracking: {
              pageName: 'vaults',
              pageType: PageType.listing,
            },
          }}
        />
      </Route>
      <Route
        path={subRoutes.billing}
        Component={ListingPage}
        handle={{
          tracking: {
            pageName: 'billing',
            pageType: PageType.listing,
          },
        }}
      />
    </Route>
    <Route path={subRoutes.vaults}>
      <Route path={subRoutes.dashboard} Component={VaultDashboardPage}>
        <Route path={urlParams.vaultId} Component={VaultGeneralInformationPage} />
      </Route>
    </Route>
  </>
);
