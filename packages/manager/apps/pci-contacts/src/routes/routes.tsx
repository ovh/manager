import { lazy } from 'react';

import { Route } from 'react-router-dom';

import { ErrorBoundary } from '@ovh-ux/manager-react-components';
import { PageType } from '@ovh-ux/manager-react-shell-client';

import { urls } from '@/routes/routes.constant';
import { CONTACTS_TRACKING } from '@/tracking.constant';

const LayoutPage = lazy(() => import('@/pages/Layout'));
const ListingPage = lazy(() => import('@/pages/listing/Listing.page'));
const AddModal = lazy(() => import('@/pages/listing/add/Add.page'));
const RemoveModal = lazy(() => import('@/pages/listing/remove/Remove.page'));

export default (
  <Route
    path={urls.root}
    Component={LayoutPage}
    errorElement={
      <ErrorBoundary isPreloaderHide={true} isRouteShellSync={true} redirectionApp="contacts" />
    }
  >
    <Route
      path={urls.listing}
      Component={ListingPage}
      handle={{
        tracking: {
          pageType: PageType.listing,
        },
      }}
    >
      <Route
        path={urls.add}
        Component={AddModal}
        handle={{
          tracking: {
            pageName: CONTACTS_TRACKING.ADD.PAGE_NAME,
            pageType: PageType.popup,
          },
        }}
      />
      <Route
        path={urls.delete}
        Component={RemoveModal}
        handle={{
          tracking: {
            pageName: CONTACTS_TRACKING.REMOVE.PAGE_NAME,
            pageType: PageType.popup,
          },
        }}
      />
    </Route>
  </Route>
);
