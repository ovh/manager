import React from 'react';

import { Navigate, Route } from 'react-router-dom';

import { ErrorBoundary } from '@ovh-ux/manager-react-components';
import { PageType } from '@ovh-ux/manager-react-shell-client';

import NotFound from '@/alldoms/pages/404';
import { urls } from '@/alldoms/routes/routes.constant';

const LayoutPage = React.lazy(() => import('@/alldoms/pages/layout'));
const AllDomListingPage = React.lazy(
  () => import('@/alldoms/pages/service/service-list/serviceList'),
);
const AllDomDetailPage = React.lazy(
  () => import('@/alldoms/pages/service/service-detail/serviceDetail'),
);
const AllDomTerminatePage = React.lazy(
  () => import('@/alldoms/pages/service/service-terminate/serviceTerminate'),
);
const AllDomCancelTerminatePage = React.lazy(
  () => import('@/alldoms/pages/service/service-cancel-terminate/serviceCancelTerminate'),
);

export default (
  <>
    <Route path={'/'} element={<Navigate to={urls.alldomsRoot} replace />} />
    <Route
      path={urls.alldomsRoot}
      Component={LayoutPage}
      id="root"
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
    <Route path="*" element={<NotFound />} />
  </>
);
