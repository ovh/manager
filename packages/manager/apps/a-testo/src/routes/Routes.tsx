import React from 'react';

import { Navigate, Route } from 'react-router-dom';

import { ErrorBoundary } from '@ovh-ux/muk';
import { PageType } from '@ovh-ux/manager-react-shell-client';

import NotFound from '@/pages/not-found/404.page';

import { redirectionApp, subRoutes, urls } from './Routes.constants';

const MainLayoutPage = React.lazy(() => import('@/pages/Main.layout'));

// const OnboardingPage = React.lazy(() =>
//   import('@/pages/onboarding/Onboarding.page'),
// );

// const DashboardPage = React.lazy(() =>
//   import('@/pages/dashboard/Dashboard.page'),
// );
// const GeneralInformationPage = React.lazy(() =>
//   import('@/pages/dashboard/general-information/GeneralInformation.page'),
// );
// const HelpPage = React.lazy(() => import('@/pages/dashboard/help/Help.page'));

// const ListingPage = React.lazy(() => import('@/pages/listing/Listing.page'));
const TestPage = React.lazy(() => import('@/pages/test/Test.component'));
const TilesInputGroupPage = React.lazy(() =>
  import('@/pages/tiles-input-group/TilesInputGroup.page'),
);
const ListingPage = React.lazy(() => import('@/pages/listing/Listing.page'));
const OnboardingPage = React.lazy(() =>
  import('@/pages/onboarding/Onboarding.page'),
);
const ListingTestPage = React.lazy(() =>
  import('@/pages/listing-2/ListingTest.page'),
);

const WebDomainsPage = React.lazy(() => import('@/pages/web-domains/WebDomains.page'));

const AllPage = React.lazy(() => import('@/pages/all/All.component'));

const NashaPage = React.lazy(() => import('@/pages/nasha/Nasha.page'));

const RecipesPage = React.lazy(() =>
  import('@/pages/recipes/Recipes.component'),
);

import AgGridPage from '@/pages/ag-grid/AgGrid.page';

export default (
  <>
    {/* Redirect container "/" → flavor-specific root (e.g. /pci/projects/:projectId/appSlug) */}
    <Route path="/" element={<Navigate to={urls.root} replace />} />

    {/* Rooted application layout */}
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
        path=""
        Component={TestPage}
        handle={{
          tracking: {
            pageName: 'listing',
            pageType: PageType.listing,
          },
        }}
      />
      <Route
        path={urls.group}
        Component={TilesInputGroupPage}
        handle={{
          tracking: {
            pageName: 'tiles-input-group',
            pageType: PageType.listing,
          },
        }}
      />
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
      <Route
        path={urls.onboarding}
        Component={OnboardingPage}
        handle={{
          tracking: {
            pageName: 'onboarding',
            pageType: PageType.onboarding,
          },
        }}
      />
      <Route
        path={urls.listingTest}
        Component={ListingTestPage}
        handle={{
          tracking: {
            pageName: 'listing-test',
            pageType: PageType.listing,
          },
        }}
      />
      <Route
        path={urls.nasha}
        Component={NashaPage}
        handle={{
          tracking: {
            pageName: 'nasha',
            pageType: PageType.listing,
          },
        }}
      />
      <Route
        path={urls.all}
        Component={AllPage}
        handle={{
          tracking: {
            pageName: 'all',
            pageType: PageType.listing,
          },
        }}
      />
      <Route
        path={urls.recipes}
        Component={RecipesPage}
        handle={{
          tracking: {
            pageName: 'recipes',
            pageType: PageType.listing,
          },
        }}
      />
      <Route
        path={urls.agGrid}
        Component={AgGridPage}
        handle={{
          tracking: {
            pageName: 'ag-grid',
            pageType: PageType.listing,
          },
        }}
      />
    <Route
        path={urls.webDomains}
        Component={WebDomainsPage}
      />
    </Route>
  </>
);
