import React from 'react';
import { Route } from 'react-router-dom';
import { ErrorBoundary } from '@ovh-ux/manager-react-components';
import { PageType } from '@ovh-ux/manager-react-shell-client';
import { urls } from '@/routes/routes.constant';
import { TRACKING } from '@/tracking.constant';

const LayoutPage = React.lazy(() => import('@/pages/layout'));
const ListingPage = React.lazy(() => import('@/pages/listing/Listing.page'));
const DeletePage = React.lazy(() =>
  import('@/pages/delete-veeam/DeleteVeeam.page'),
);
const DashboardPage = React.lazy(() =>
  import('@/pages/dashboard/Dashboard.page'),
);
const EditDisplayNamePage = React.lazy(() =>
  import('@/pages/edit-name/EditVeeamBackupDisplayNameModal.page'),
);
const OrderPage = React.lazy(() =>
  import('@/pages/order-veeam/OrderVeeam.page'),
);
const OnboardingPage = React.lazy(() =>
  import('@/pages/onboarding/Onboarding.page'),
);

const ActivateOfferModal = React.lazy(() =>
  import('@/pages/activate-offer/ActivateOfferModal.page'),
);

export default (
  <Route
    id="root"
    path={urls.root}
    Component={LayoutPage}
    errorElement={
      <ErrorBoundary
        redirectionApp="veeam-backup"
        isPreloaderHide={true}
        isRouteShellSync={true}
      />
    }
  >
    <Route
      id="listing"
      path={urls.listing}
      handle={{
        tracking: TRACKING.listing.page,
      }}
      Component={ListingPage}
    >
      <Route
        id="delete-veeam"
        path={urls.deleteVeeam}
        handle={{
          tracking: TRACKING.deleteVeeam.page,
        }}
        Component={DeletePage}
      />
    </Route>
    <Route
      id="dashboard"
      path={urls.dashboard}
      handle={{
        tracking: TRACKING.dashboard.page,
      }}
      Component={DashboardPage}
    >
      <Route
        id="edit-veeam-dashboard"
        path={urls.editVeeamDisplayNameFromDashboard}
        handle={{
          tracking: TRACKING.editVeeamDisplayNameFromDashboard.page,
        }}
        Component={EditDisplayNamePage}
      />
      <Route
        id="delete-veeam-dashboard"
        path={urls.deleteVeeamFromDashboard}
        handle={{
          tracking: TRACKING.deleteVeeamFromDashboard.page,
        }}
        Component={DeletePage}
      />
      <Route
        id="activate-veeam-offer"
        path={urls.activateVeeamBackupOffer}
        handle={{
          tracking: TRACKING.activateVeeamBackupOffer.page,
        }}
        Component={ActivateOfferModal}
      />
    </Route>
    <Route
      id="order-veeam"
      path={urls.orderVeeam}
      handle={{
        tracking: TRACKING.orderVeeam.page,
      }}
      Component={OrderPage}
    />
    <Route
      id="onboarding"
      path={urls.onboarding}
      handle={{
        tracking: TRACKING.onboarding.page,
      }}
      Component={OnboardingPage}
    />
  </Route>
);
