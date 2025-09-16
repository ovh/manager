import { lazy } from 'react';
import { Route } from 'react-router-dom';
import { PageType } from '@ovh-ux/manager-react-shell-client';
import { ErrorBoundary } from '@ovh-ux/manager-react-components';
import { urls } from '@/routes/routes.constant';
import { PROJECTS_TRACKING } from '@/tracking.constant';

const LayoutPage = lazy(() => import('@/pages/Layout'));
const ListingPage = lazy(() => import('@/pages/listing/Listing.page'));
const AddModal = lazy(() => import('@/pages/listing/add/Add.page'));
const DeleteModal = lazy(() => import('@/pages/listing/remove/Remove.page'));

export default (
  <Route
    path={urls.root}
    Component={LayoutPage}
    errorElement={
      <ErrorBoundary
        isPreloaderHide={true}
        isRouteShellSync={true}
        redirectionApp="contacts"
      />
    }
  >
    <Route
      path={urls.listing}
      Component={ListingPage}
      handle={{
        tracking: {
          pageName: PROJECTS_TRACKING.LISTING.PAGE_NAME,
          pageType: PageType.listing,
        },
      }}
    >
      <Route
        path={urls.add}
        Component={AddModal}
        handle={{
          tracking: {
            pageName: PROJECTS_TRACKING.ADD.PAGE_NAME,
            pageType: PageType.popup,
          },
        }}
      />
      <Route
        path={urls.delete}
        Component={DeleteModal}
        handle={{
          tracking: {
            pageName: PROJECTS_TRACKING.DELETE.PAGE_NAME,
            pageType: PageType.popup,
          },
        }}
      />
    </Route>
  </Route>
);
