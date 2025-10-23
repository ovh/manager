import React from 'react';

import { Navigate, Route } from 'react-router-dom';

import { PageType } from '@ovh-ux/manager-react-shell-client';
import ErrorBoundary from '@/components/debug/ErrorBoundary.component';

import { redirectionApp, urls } from './Routes.constants';

const MainLayoutPage = React.lazy(() => import('@/pages/Main.layout'));

const ListingPage = React.lazy(() => import('@/pages/listing/Listing.page'));

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
      {/* Default landing inside root → listing page */}
      <Route
        index
        Component={ListingPage}
        handle={{
          tracking: {
            pageName: 'listing',
            pageType: PageType.listing,
          },
        }}
      />

      {/* Listing route (alternative path) */}
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

      {/* Catch-all redirect to listing */}
      <Route path="*" element={<Navigate to="." replace />} />
    </Route>
  </>
);
