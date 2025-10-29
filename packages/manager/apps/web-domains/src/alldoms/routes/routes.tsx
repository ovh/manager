import React from 'react';
import { Navigate, Route } from 'react-router-dom';
import { PageType } from '@ovh-ux/manager-react-shell-client';
import { ErrorBoundary } from '@ovh-ux/manager-react-components';
import { urls } from '@/alldoms/routes/routes.constant';

const LayoutPage = React.lazy(() => import('@/alldoms/pages/layout'));
const AllDomListingPage = React.lazy(() =>
  import('@/alldoms/pages/service/serviceList/serviceList'),
);
const AllDomDetailPage = React.lazy(() =>
  import('@/alldoms/pages/service/serviceDetail/serviceDetail'),
);
const AllDomTerminatePage = React.lazy(() =>
  import('@/alldoms/pages/service/serviceTerminate/serviceTerminate'),
);
const AllDomCancelTerminatePage = React.lazy(() =>
  import(
    '@/alldoms/pages/service/serviceCancelTerminate/serviceCancelTerminate'
  ),
);

export default (
  <>
    <Route
      path={urls.alldomsRoot}
      Component={LayoutPage}
      id="alldom-root"
      errorElement={
        <ErrorBoundary
          redirectionApp="web-domains-alldoms-backup"
          isPreloaderHide
          isRouteShellSync
        />
      }
    >
      <Route
        path={urls.alldomsRoot}
        Component={AllDomListingPage}
        id="allDomListing"
        handle={{
          tracking: {
            pageName: 'listing',
            pageType: PageType.listing,
          },
        }}
      >
        <Route
          path={urls.alldomsListingTerminate}
          Component={AllDomTerminatePage}
          id="allDomListingTerminate"
        ></Route>
        <Route
          path={urls.alldomsListingCancelTerminate}
          Component={AllDomCancelTerminatePage}
          id="allDomListingCancelTerminate"
        ></Route>
      </Route>

      <Route
        path={urls.alldomsDetail}
        Component={AllDomDetailPage}
        id="allDomDetail"
        handle={{
          tracking: {
            pageName: 'listing',
            pageType: PageType.listing,
          },
        }}
      >
        <Route
          path={urls.alldomsDetailTerminate}
          Component={AllDomTerminatePage}
          id="allDomDetailTerminate"
        ></Route>
        <Route
          path={urls.alldomsDetailCancelTerminate}
          Component={AllDomCancelTerminatePage}
          id="allDomDetailCancelTerminate"
        ></Route>
      </Route>
    </Route>
  </>
);
