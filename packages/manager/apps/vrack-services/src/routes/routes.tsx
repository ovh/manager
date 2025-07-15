import React from 'react';
import { RouteObject, Route } from 'react-router-dom';
import {
  PageType,
  TrackingPageParams,
} from '@ovh-ux/manager-react-shell-client';
import { ErrorBoundary } from '@ovh-ux/manager-react-components';
import { urls } from './routes.constants';
import { PageName } from '@/utils/tracking';

export type RouteConfig = {
  id?: string;
  pageImport: CallableFunction;
  path: string;
  tracking?: TrackingPageParams;
  currentPage?: string;
  children?: RouteObject[];
};

const RootWrapper = React.lazy(() => import('@/pages/RootWrapper.page'));
const DashboardWrapper = React.lazy(() =>
  import('@/pages/DashboardWrapper.page'),
);
const ListingPage = React.lazy(() => import('@/pages/listing/Listing.page'));
const AssociateVrackModal = React.lazy(() =>
  import('@/pages/associate/AssociateVrackModal.page'),
);
const AssociateAnotherVrackModal = React.lazy(() =>
  import('@/pages/associate-another/AssociateAnotherVrackModal.page'),
);
const DissociateModal = React.lazy(() =>
  import('@/pages/dissociate/DissociateModal.page'),
);
const EditVrackServicesDisplayNameModal = React.lazy(() =>
  import('@/pages/edit-display-name/EditVrackServicesDisplayNameModal.page'),
);
const DeleteVrackServicesModal = React.lazy(() =>
  import('@/pages/listing/delete/DeleteVrackServicesModal.page'),
);
const OnboardingPage = React.lazy(() =>
  import('@/pages/onboarding/Onboarding.page'),
);
const CreateVrackServicesPage = React.lazy(() =>
  import('@/pages/create-vs/CreateVrackServices.page'),
);
const CreateConfirmModal = React.lazy(() =>
  import('@/pages/create-vs/confirm/CreateConfirmModal.page'),
);
const OverviewTabPage = React.lazy(() =>
  import('@/pages/overview/OverviewTab.page'),
);
const SubnetsTabPage = React.lazy(() =>
  import('@/pages/subnets/SubnetsTab.page'),
);
const SubnetsOnboardingPage = React.lazy(() =>
  import('@/pages/subnets/onboarding/SubnetsOnboarding.page'),
);
const SubnetsListingPage = React.lazy(() =>
  import('@/pages/subnets/subnets-listing/SubnetsListing.page'),
);
const EditSubnetModal = React.lazy(() =>
  import('@/pages/subnets/edit/EditSubnetModal.page'),
);
const SubnetDeleteModal = React.lazy(() =>
  import('@/pages/subnets/delete/SubnetDeleteModal.page'),
);
const SubnetCreatePage = React.lazy(() =>
  import('@/pages/create-subnet/SubnetCreate.page'),
);
const EndpointsTabPage = React.lazy(() =>
  import('@/pages/endpoints/EndpointsTab.page'),
);
const EndpointsOnboardingPage = React.lazy(() =>
  import('@/pages/endpoints/onboarding/EndpointsOnboarding.page'),
);
const EndpointsListingPage = React.lazy(() =>
  import('@/pages/endpoints/endpoints-listing/EndpointsListing.page'),
);
const EndpointDeleteModal = React.lazy(() =>
  import('@/pages/endpoints/delete/EndpointDeleteModal.page'),
);
const EndpointCreatePage = React.lazy(() =>
  import('@/pages/create-endpoint/EndpointCreate.page'),
);
const NotFound = React.lazy(() => import('@/pages/not-found/404.page'));

export default (
  <>
    <Route
      id="root"
      path={urls.root}
      Component={RootWrapper}
      errorElement={
        <ErrorBoundary
          redirectionApp="vrack-services"
          isPreloaderHide={true}
          isRouteShellSync={true}
        />
      }
    >
      <Route
        id="vrack-services.listing"
        path={urls.listing}
        handle={{
          tracking: { pageType: PageType.listing },
          currentPage: 'vrack-services.listing',
        }}
        Component={ListingPage}
      >
        <Route
          id="vrack-services.associate"
          path={urls.listingAssociate}
          handle={{
            tracking: {
              pageType: PageType.popup,
              pageName: PageName.associate,
            },
            currentPage: 'vrack-services.associate',
          }}
          Component={AssociateVrackModal}
        />
        <Route
          id="vrack-services.associate-another"
          path={urls.listingAssociateAnother}
          handle={{
            tracking: {
              pageType: PageType.popup,
              pageName: PageName.associateAnother,
            },
            currentPage: 'vrack-services.associate-another',
          }}
          Component={AssociateAnotherVrackModal}
        />
        <Route
          id="vrack-services.dissociate"
          path={urls.listingDissociate}
          handle={{
            tracking: {
              pageType: PageType.popup,
              pageName: PageName.dissociate,
            },
            currentPage: 'vrack-services.dissociate',
          }}
          Component={DissociateModal}
        />
        <Route
          id="vrack-services.listing.edit"
          path={urls.listingEdit}
          handle={{
            tracking: {
              pageType: PageType.popup,
              pageName: PageName.edit,
            },
            currentPage: 'vrack-services.listing.edit',
          }}
          Component={EditVrackServicesDisplayNameModal}
        />
        <Route
          id="vrack-services.listing.delete"
          path={urls.listingDelete}
          handle={{
            tracking: {
              pageType: PageType.popup,
              pageName: PageName.delete,
            },
            currentPage: 'vrack-services.listing.delete',
          }}
          Component={DeleteVrackServicesModal}
        />
      </Route>
      <Route
        id="vrack-services.onboarding"
        path={urls.onboarding}
        handle={{
          tracking: {
            pageType: PageType.onboarding,
          },
          currentPage: 'vrack-services.onboarding',
        }}
        Component={OnboardingPage}
      />
      <Route
        id="vrack-services.create"
        path={urls.createVrackServices}
        handle={{
          tracking: {
            pageType: PageType.funnel,
            pageName: PageName.createVrackServices,
          },
          currentPage: 'vrack-services.create',
        }}
        Component={CreateVrackServicesPage}
      >
        <Route
          id="vrack-services.create-confirm"
          path={urls.createConfirm}
          handle={{
            tracking: {
              pageType: PageType.popup,
              pageName: PageName.createVrackServices,
            },
            currentPage: 'vrack-services.create',
          }}
          Component={CreateConfirmModal}
        />
      </Route>
      <Route id="dashboard" path={urls.dashboard} Component={DashboardWrapper}>
        <Route
          id="vrack-services.dashboard"
          path={urls.overview}
          handle={{
            tracking: {
              pageType: PageType.dashboard,
              pageName: PageName.overview,
            },
            currentPage: 'vrack-services.dashboard',
          }}
          Component={OverviewTabPage}
        >
          <Route
            id="vrack-services.dashboard.associate"
            path={urls.overviewAssociate}
            handle={{
              tracking: {
                pageType: PageType.popup,
                pageName: PageName.associate,
              },
              currentPage: 'vrack-services.dashboard.associate',
            }}
            Component={AssociateVrackModal}
          />
          <Route
            id="vrack-services.dashboard.dissociate"
            path={urls.overviewDissociate}
            handle={{
              tracking: {
                pageType: PageType.popup,
                pageName: PageName.dissociate,
              },
              currentPage: 'vrack-services.dashboard.dissociate',
            }}
            Component={DissociateModal}
          />
          <Route
            id="vrack-services.dashboard.edit"
            path={urls.overviewEdit}
            handle={{
              tracking: {
                pageType: PageType.popup,
                pageName: PageName.edit,
              },
              currentPage: 'vrack-services.dashboard.edit',
            }}
            Component={EditVrackServicesDisplayNameModal}
          />
          <Route
            id="vrack-services.dashboard.associate-another"
            path={urls.overviewAssociateAnother}
            handle={{
              tracking: {
                pageType: PageType.popup,
                pageName: PageName.associateAnother,
              },
              currentPage: 'vrack-services.dashboard.associate-another',
            }}
            Component={AssociateAnotherVrackModal}
          />
        </Route>

        <Route
          id="vrack-services.subnets"
          path={urls.subnets}
          Component={SubnetsTabPage}
        >
          <Route
            id="vrack-services.subnets.onboarding"
            path={urls.subnetsOnboarding}
            handle={{
              tracking: {
                pageType: PageType.onboarding,
                pageName: PageName.subnets,
              },
              currentPage: 'vrack-services.subnets.onboarding',
            }}
            Component={SubnetsOnboardingPage}
          />
          <Route
            id="vrack-services.subnets.listing"
            path={urls.subnetsListing}
            handle={{
              tracking: {
                pageType: PageType.listing,
                pageName: PageName.subnets,
              },
              currentPage: 'vrack-services.subnets.listing',
            }}
            Component={SubnetsListingPage}
          >
            <Route
              id="vrack-services.subnets.listing.edit"
              path={urls.subnetsEdit}
              handle={{
                tracking: {
                  pageType: PageType.popup,
                  pageName: PageName.editSubnets,
                },
                currentPage: 'vrack-services.subnets.listing.edit',
              }}
              Component={EditSubnetModal}
            />
            <Route
              id="vrack-services.subnets.listing.delete"
              path={urls.subnetsDelete}
              handle={{
                tracking: {
                  pageType: PageType.popup,
                  pageName: PageName.deleteSubnets,
                },
                currentPage: 'vrack-services.subnets.listing.delete',
              }}
              Component={SubnetDeleteModal}
            />
          </Route>
        </Route>
        <Route
          id="vrack-services.subnets.create"
          path={urls.createSubnet}
          handle={{
            tracking: {
              pageType: PageType.funnel,
              pageName: PageName.createSubnets,
            },
            currentPage: 'vrack-services.subnets.create',
          }}
          Component={SubnetCreatePage}
        />
        <Route
          id="vrack-services.endpoints"
          path={urls.endpoints}
          Component={EndpointsTabPage}
        >
          <Route
            id="vrack-services.endpoints.onboarding"
            path={urls.endpointsOnboarding}
            handle={{
              tracking: {
                pageType: PageType.onboarding,
                pageName: PageName.endpoints,
              },
              currentPage: 'vrack-services.endpoints.onboarding',
            }}
            Component={EndpointsOnboardingPage}
          />
          <Route
            id="vrack-services.endpoints.listing"
            path={urls.endpointsListing}
            handle={{
              tracking: {
                pageType: PageType.listing,
                pageName: PageName.endpoints,
              },
              currentPage: 'vrack-services.endpoints.listing',
            }}
            Component={EndpointsListingPage}
          >
            <Route
              id="vrack-services.endpoints.listing.delete"
              path={urls.endpointsDelete}
              handle={{
                tracking: {
                  pageType: PageType.popup,
                  pageName: PageName.deleteEndpoints,
                },
                currentPage: 'vrack-services.endpoints.listing.delete',
              }}
              Component={EndpointDeleteModal}
            />
          </Route>
        </Route>
        <Route
          id="vrack-services.endpoints.create"
          path={urls.createEndpoint}
          handle={{
            tracking: {
              pageType: PageType.funnel,
              pageName: PageName.createEndpoints,
            },
            currentPage: 'vrack-services.endpoints.create',
          }}
          Component={EndpointCreatePage}
        />
      </Route>
    </Route>
    <Route path="*" Component={NotFound}></Route>
  </>
);
