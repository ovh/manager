import { ErrorBoundary } from '@ovh-ux/manager-react-components';
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { PageType } from '@ovh-ux/manager-react-shell-client';
import NotFound from '@/pages/404';
import { subRoutes, urls } from '@/routes/routes.constant';

const LayoutPage = React.lazy(() => import('@/pages/layout'));
const OnboardingPage = React.lazy(() =>
  import('@/pages/onboarding/Onboarding.page'),
);
const ListingPage = React.lazy(() =>
  import('@/pages/listing/organizations/Organizations.page'),
);
const OrganizationDashboardPage = React.lazy(() =>
  import('@/pages/dashboard/organization/OrganizationDashboard.page'),
);
const OrganizationGeneralInformationPage = React.lazy(() =>
  import(
    '@/pages/dashboard/organization/general-information/OrganizationGeneralInformation.page'
  ),
);
const OrganizationEditNamePage = React.lazy(() =>
  import(
    '@/pages/dashboard/organization/general-information/edit/EditName.page'
  ),
);
const OrganizationEditDescriptionPage = React.lazy(() =>
  import(
    '@/pages/dashboard/organization/general-information/edit/EditDescription.page'
  ),
);
const OrganizationResetPasswordPage = React.lazy(() =>
  import(
    '@/pages/dashboard/organization/general-information/edit/EditPassword.page'
  ),
);
const DatacentresPage = React.lazy(() =>
  import('@/pages/listing/datacentres/Datacentres.page'),
);
const DatacentreDashboardPage = React.lazy(() =>
  import('@/pages/dashboard/datacentre/DatacentreDashboard.page'),
);
const DatacentreGeneralInformationPage = React.lazy(() =>
  import(
    '@/pages/dashboard/datacentre/general-informations/DatacentreGeneralInformation.page'
  ),
);
const DatacentreEditDescriptionPage = React.lazy(() =>
  import(
    '@/pages/dashboard/datacentre/general-informations/edit/EditVdcDescription.page'
  ),
);
const DatacentreStoragePage = React.lazy(() =>
  import('@/pages/dashboard/datacentre/storage/DatacentreStorage.page'),
);
const DatacentreStorageOrderPage = React.lazy(() =>
  import(
    '@/pages/dashboard/datacentre/storage-order/DatacentreStorageOrder.page'
  ),
);
const DatacentreComputePage = React.lazy(() =>
  import('@/pages/dashboard/datacentre/compute/DatacentreCompute.page'),
);
const DatacentreComputeOrderPage = React.lazy(() =>
  import(
    '@/pages/dashboard/datacentre/compute-order/DatacentreComputeOrder.page'
  ),
);

const DatacenterVrackSegmentPage = React.lazy(() =>
  import('@/pages/dashboard/datacentre/vrack-segment/DatacentreVrack.page'),
);

const EditVrackSegmentIdPage = React.lazy(() =>
  import(
    '@/pages/dashboard/datacentre/vrack-segment/edit/EditVrackSegmentId.page'
  ),
);

const DeleteVrackNetworkPage = React.lazy(() =>
  import(
    '@/pages/dashboard/datacentre/vrack-segment/delete-network/DeleteVrackNetwork.page'
  ),
);

const AddNetworkInVrackSegmentPage = React.lazy(() =>
  import(
    '@/pages/dashboard/datacentre/vrack-segment/add-network/AddNetworkInVrackSegment.page'
  ),
);

const DeleteVrackSegmentPage = React.lazy(() =>
  import(
    '@/pages/dashboard/datacentre/vrack-segment/delete-segment/DeleteVrackSegment.page'
  ),
);

const TerminateOrganizationPage = React.lazy(() =>
  import('@/pages/terminate/TerminateOrganization.page'),
);

export default (
  <>
    <Route path="/" element={<Navigate to={urls.root} replace />} />
    <Route
      path={urls.root}
      Component={LayoutPage}
      id={'root'}
      errorElement={
        <ErrorBoundary
          redirectionApp="hpc-vmware-managed-vcd-backup"
          isPreloaderHide={true}
          isRouteShellSync={true}
        />
      }
    >
      <Route
        id={'listing'}
        path={urls.listing}
        Component={ListingPage}
        handle={{
          tracking: {
            pageName: 'listing',
            pageType: PageType.listing,
          },
        }}
      >
        <Route
          id="listing-terminate"
          path={`${subRoutes.terminate}/:id`}
          Component={TerminateOrganizationPage}
          handle={{
            tracking: {
              pageName: 'delete_vcfaas',
              pageType: PageType.popup,
            },
          }}
        />
      </Route>
      <Route path={urls.dashboard} Component={OrganizationDashboardPage}>
        <Route
          id={'dashboard'}
          path={''}
          Component={OrganizationGeneralInformationPage}
          handle={{
            tracking: {
              pageName: 'general-information',
              pageType: PageType.dashboard,
            },
          }}
        >
          <Route
            id={'edit-name'}
            path={urls.editName}
            Component={OrganizationEditNamePage}
            handle={{
              tracking: {
                pageName: 'edit-name',
                pageType: PageType.popup,
              },
            }}
          />
          <Route
            id={'edit-description'}
            path={urls.editDescription}
            Component={OrganizationEditDescriptionPage}
            handle={{
              tracking: {
                pageName: 'edit-description',
                pageType: PageType.popup,
              },
            }}
          />
          <Route
            id={'reset-password'}
            path={urls.resetPassword}
            Component={OrganizationResetPasswordPage}
            handle={{
              tracking: {
                pageName: 'reset-password',
                pageType: PageType.popup,
              },
            }}
          />
          <Route
            id="dashboard-terminate"
            path={subRoutes.terminate}
            Component={TerminateOrganizationPage}
            handle={{
              tracking: {
                pageName: 'delete_vcfaas',
                pageType: PageType.popup,
              },
            }}
          />
        </Route>
        <Route
          id={'datacentres'}
          path={urls.datacentres}
          Component={DatacentresPage}
          handle={{
            tracking: {
              pageName: 'datacenters',
              pageType: PageType.listing,
            },
          }}
        />
      </Route>
      <Route
        path={urls.datacentreDashboard}
        Component={DatacentreDashboardPage}
        handle={{
          tracking: {
            pageName: 'datacenter',
            pageType: PageType.dashboard,
          },
        }}
      >
        <Route
          id={'vDcDashboard'}
          path={''}
          Component={DatacentreGeneralInformationPage}
          handle={{
            tracking: {
              pageName: 'datacenter',
              pageType: PageType.dashboard,
            },
          }}
        >
          <Route
            id={'vdc-edit-description'}
            path={urls.datacentreEditDescription}
            Component={DatacentreEditDescriptionPage}
            handle={{
              tracking: {
                pageName: 'vdc-edit-description',
                pageType: PageType.popup,
              },
            }}
          />
        </Route>
        <Route
          id={'vDcStorage'}
          path={urls.datacentreStorage}
          Component={DatacentreStoragePage}
          handle={{
            tracking: {
              pageName: 'storage',
              pageType: PageType.listing,
            },
          }}
        />
        <Route
          id={'vDcStorage-order'}
          path={urls.datacentreStorageOrder}
          Component={DatacentreStorageOrderPage}
          handle={{
            tracking: {
              pageName: 'storage-order',
              pageType: PageType.funnel,
            },
          }}
        />
        <Route
          id={'vrack-segment'}
          path={urls.vrackSegments}
          Component={DatacenterVrackSegmentPage}
        >
          <Route
            id={'edit-vlan-id'}
            path={urls.vrackSegmentEditVlanId}
            Component={EditVrackSegmentIdPage}
          />
          <Route
            id={'delete-segment'}
            path={urls.vrackSegmentDelete}
            Component={DeleteVrackSegmentPage}
          />
          <Route
            id={'delete-network'}
            path={urls.vrackSegmentDeleteNetwork}
            Component={DeleteVrackNetworkPage}
          />
          <Route
            id={'add-network'}
            path={urls.vrackSegmentAddNetwork}
            Component={AddNetworkInVrackSegmentPage}
          />
        </Route>
        <Route
          id={'vDcCompute'}
          path={urls.datacentreCompute}
          Component={DatacentreComputePage}
          handle={{
            tracking: {
              pageName: 'compute',
              pageType: PageType.listing,
            },
          }}
        />
        <Route
          id={'vDcCompute-order'}
          path={urls.datacentreComputeOrder}
          Component={DatacentreComputeOrderPage}
          handle={{
            tracking: {
              pageName: 'upgrade_vcpu-speed',
              pageType: PageType.popup,
            },
          }}
        />
      </Route>
      <Route
        id={'onboarding'}
        path={urls.onboarding}
        Component={OnboardingPage}
        handle={{
          tracking: {
            pageName: 'onboarding',
            pageType: PageType.onboarding,
          },
        }}
      />
      <Route path={'*'} element={<NotFound />} />
    </Route>
  </>
);
