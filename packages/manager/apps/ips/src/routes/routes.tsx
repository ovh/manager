import React from 'react';
import { Route } from 'react-router-dom';
import { PageType } from '@ovh-ux/manager-react-shell-client';
import { ErrorBoundary } from '@ovh-ux/manager-react-components';

import { subRoutes, urls } from '@/routes/routes.constant';
import NotFound from '@/pages/404';
import Layout from '@/pages/layout';

// Lazy-loaded pages as components
const ListingPage = React.lazy(() => import('@/pages/listing'));
const IpListingPage = React.lazy(() =>
  import('@/pages/listing/ipListing/ip.listing.page'),
);
const ConfigureReverseDnsPage = React.lazy(() =>
  import('@/pages/actions/configureReverseDns/configureReverseDns.page'),
);
const TerminateIpPage = React.lazy(() =>
  import('@/pages/actions/terminate/terminateIp.page'),
);
const TerminateByoipPage = React.lazy(() =>
  import('@/pages/actions/terminate/terminateByoip.page'),
);
const MoveIpPage = React.lazy(() =>
  import('@/pages/actions/moveIp/moveIp.page'),
);
const UpsertDescriptionPage = React.lazy(() =>
  import('@/pages/actions/upsertDescription/upsertDescription.page'),
);
const AddVirtualMacPage = React.lazy(() =>
  import('@/pages/actions/virtualMac/addVirtualMac.page'),
);
const ViewVirtualMacPage = React.lazy(() =>
  import('@/pages/actions/virtualMac/viewVirtualMac.page'),
);
const IpBlockInformationPage = React.lazy(() =>
  import(
    '@/pages/actions/upsertIpBlockInformation/upsertIpBlockInformation.page'
  ),
);
const DeleteVirtualMacPage = React.lazy(() =>
  import('@/pages/actions/virtualMac/deleteVirtualMac.page'),
);
const ImportIpFromSysPage = React.lazy(() =>
  import('@/pages/actions/importIpFromSys/importIpFromSys.page'),
);
const UnblockAntiHackPage = React.lazy(() =>
  import('@/pages/actions/antiHack/unblockAntiHack.page'),
);
const UnblockAntiSpamPage = React.lazy(() =>
  import('@/pages/actions/antiSpam/unblockAntiSpam.page'),
);
const ExportIpToCsvPage = React.lazy(() =>
  import('@/pages/actions/exportIpToCsv/exportIpToCsv.page'),
);
const SlicePage = React.lazy(() => import('@/pages/actions/slice/slice.page'));
const AggregatePage = React.lazy(() =>
  import('@/pages/actions/aggregate/aggregate.page'),
);
const ManageOrganisationsPage = React.lazy(() =>
  import('@/pages/listing/manageOrganisations/manage.organisations.page'),
);
const OrganisationModalPage = React.lazy(() =>
  import(
    '@/pages/listing/manageOrganisations/OrganisationModal/OrganisationModal.page'
  ),
);
const DeleteOrganisationPage = React.lazy(() =>
  import('@/pages/actions/organisation/deleteOrganisation.page'),
);
const ConfigureGameFirewallPage = React.lazy(() =>
  import('@/pages/configureGameFirewall/configureGameFirewall.page'),
);
const ConfigureEdgeNetworkFirewallPage = React.lazy(() =>
  import(
    '@/pages/configureEdgeNetworkFirewall/configureEdgeNetworkFirewall.page'
  ),
);
const OnboardingPage = React.lazy(() => import('@/pages/onboarding'));
const OrderPage = React.lazy(() => import('@/pages/order/Order.page'));
const ByoipPage = React.lazy(() => import('@/pages/byoip/Byoip.page'));
const ByoipOrderModalPage = React.lazy(() =>
  import('@/pages/byoip/ByoipOrderModal/ByoipOrderModal.page'),
);

export const Routes = [
  <Route
    key="/"
    path="/"
    Component={Layout}
    errorElement={<ErrorBoundary redirectionApp="ips" />}
  >
    <Route
      id="listing"
      path={urls.listing}
      element={
        <React.Suspense fallback={null}>
          <ListingPage />
        </React.Suspense>
      }
      handle={{
        tracking: {
          pageName: 'listing',
          pageType: PageType.listing,
        },
      }}
    >
      <Route
        id="ips"
        path=""
        element={
          <React.Suspense fallback={null}>
            <IpListingPage />
          </React.Suspense>
        }
        handle={{
          tracking: {
            pageName: 'all-ip',
            pageType: PageType.listing,
          },
        }}
      >
        <Route
          id={subRoutes.configureReverseDns}
          path={urls.listingConfigureReverseDns}
          element={
            <React.Suspense fallback={null}>
              <ConfigureReverseDnsPage />
            </React.Suspense>
          }
          handle={{
            tracking: {
              pageName: 'configure_reverse-dns',
              pageType: PageType.popup,
            },
          }}
        />
        <Route
          id={subRoutes.terminateIp}
          path={urls.listingIpTerminate}
          element={
            <React.Suspense fallback={null}>
              <TerminateIpPage />
            </React.Suspense>
          }
          handle={{
            tracking: {
              pageName: 'terminate_additional-ip',
              pageType: PageType.popup,
            },
          }}
        />
        <Route
          id={subRoutes.terminateByoip}
          path={urls.listingByoipTerminate}
          element={
            <React.Suspense fallback={null}>
              <TerminateByoipPage />
            </React.Suspense>
          }
          handle={{
            tracking: {
              pageName: 'terminate_bring-your-own-ip',
              pageType: PageType.popup,
            },
          }}
        />
        <Route
          id={subRoutes.moveIp}
          path={urls.listingMoveIp}
          element={
            <React.Suspense fallback={null}>
              <MoveIpPage />
            </React.Suspense>
          }
          handle={{
            tracking: {
              pageName: 'configure_move-ip',
              pageType: PageType.popup,
            },
          }}
        />
        <Route
          id={subRoutes.upsertDescription}
          path={urls.upsertDescription}
          element={
            <React.Suspense fallback={null}>
              <UpsertDescriptionPage />
            </React.Suspense>
          }
          handle={{
            tracking: {
              pageName: 'edit_description',
              pageType: PageType.popup,
            },
          }}
        />
        <Route
          id={subRoutes.addVirtualMac}
          path={urls.addVirtualMac}
          element={
            <React.Suspense fallback={null}>
              <AddVirtualMacPage />
            </React.Suspense>
          }
          handle={{
            tracking: {
              pageName: 'add_virtual-mac',
              pageType: PageType.popup,
            },
          }}
        />
        <Route
          id={subRoutes.viewVirtualMac}
          path={urls.viewVirtualMac}
          element={
            <React.Suspense fallback={null}>
              <ViewVirtualMacPage />
            </React.Suspense>
          }
          handle={{
            tracking: {
              pageName: 'view_virtual-mac',
              pageType: PageType.popup,
            },
          }}
        />
        <Route
          id={subRoutes.ipBlockInformation}
          path={urls.ipBlockInformation}
          element={
            <React.Suspense fallback={null}>
              <IpBlockInformationPage />
            </React.Suspense>
          }
          handle={{
            tracking: {
              pageName: 'edit_ip-block-information',
              pageType: PageType.popup,
            },
          }}
        />
        <Route
          id={subRoutes.deleteVirtualMac}
          path={urls.deleteVirtualMac}
          element={
            <React.Suspense fallback={null}>
              <DeleteVirtualMacPage />
            </React.Suspense>
          }
          handle={{
            tracking: {
              pageName: 'delete_virtual-mac',
              pageType: PageType.popup,
            },
          }}
        />
        <Route
          id={subRoutes.importIpFromSys}
          path={urls.listingImportIpFromSys}
          element={
            <React.Suspense fallback={null}>
              <ImportIpFromSysPage />
            </React.Suspense>
          }
          handle={{
            tracking: {
              pageName: 'import_sys-ip',
              pageType: PageType.popup,
            },
          }}
        />
        <Route
          id={subRoutes.unblockAntiHack}
          path={urls.unblockAntiHack}
          element={
            <React.Suspense fallback={null}>
              <UnblockAntiHackPage />
            </React.Suspense>
          }
          handle={{
            tracking: {
              pageName: 'configure_unblock-anti-hack',
              pageType: PageType.popup,
            },
          }}
        />
        <Route
          id={subRoutes.unblockAntiSpam}
          path={urls.unblockAntiSpam}
          element={
            <React.Suspense fallback={null}>
              <UnblockAntiSpamPage />
            </React.Suspense>
          }
          handle={{
            tracking: {
              pageName: 'configure_unblock-anti-spam',
              pageType: PageType.popup,
            },
          }}
        />
        <Route
          id={subRoutes.exportIpToCsv}
          path={urls.listingExportIpToCsv}
          element={
            <React.Suspense fallback={null}>
              <ExportIpToCsvPage />
            </React.Suspense>
          }
          handle={{
            tracking: {
              pageName: 'export-ip-to-csv',
              pageType: PageType.popup,
            },
          }}
        />
        <Route
          id={subRoutes.slice}
          path={urls.slice}
          element={
            <React.Suspense fallback={null}>
              <SlicePage />
            </React.Suspense>
          }
          handle={{
            tracking: {
              pageName: 'slice',
              pageType: PageType.popup,
            },
          }}
        />
        <Route
          id={subRoutes.aggregate}
          path={urls.aggregate}
          element={
            <React.Suspense fallback={null}>
              <AggregatePage />
            </React.Suspense>
          }
          handle={{
            tracking: {
              pageName: 'aggregate',
              pageType: PageType.popup,
            },
          }}
        />
      </Route>
      <Route
        id="manage-organisations"
        path={urls.manageOrganisations}
        element={
          <React.Suspense fallback={null}>
            <ManageOrganisationsPage />
          </React.Suspense>
        }
        handle={{
          tracking: {
            pageName: 'manage-organizations',
            pageType: PageType.listing,
          },
        }}
      >
        <Route
          id="open"
          path={urls.openOrganisationsModal}
          element={
            <React.Suspense fallback={null}>
              <OrganisationModalPage />
            </React.Suspense>
          }
          handle={{
            tracking: {
              pageName: 'edit_manage-organizations',
              pageType: PageType.popup,
            },
          }}
        />
        <Route
          id={subRoutes.deleteOrganisation}
          path={urls.deleteOrganisation}
          element={
            <React.Suspense fallback={null}>
              <DeleteOrganisationPage />
            </React.Suspense>
          }
          handle={{
            tracking: {
              pageName: 'delete_manage-organizations',
              pageType: PageType.popup,
            },
          }}
        />
      </Route>
    </Route>
    <Route
      id={subRoutes.configureGameFirewall}
      path={urls.configureGameFirewall}
      element={
        <React.Suspense fallback={null}>
          <ConfigureGameFirewallPage />
        </React.Suspense>
      }
      handle={{
        tracking: {
          pageName: 'configure-game-firewall',
          pageType: PageType.listing,
        },
      }}
    />
    <Route
      id={subRoutes.configureEdgeNetworkFirewall}
      path={urls.configureEdgeNetworkFirewall}
      element={
        <React.Suspense fallback={null}>
          <ConfigureEdgeNetworkFirewallPage />
        </React.Suspense>
      }
      handle={{
        tracking: {
          pageName: 'configure-edge-firewall',
          pageType: PageType.listing,
        },
      }}
    />
    <Route
      id="onboarding"
      path={urls.onboarding}
      element={
        <React.Suspense fallback={null}>
          <OnboardingPage />
        </React.Suspense>
      }
      handle={{
        tracking: {
          pageName: '',
          pageType: PageType.onboarding,
        },
      }}
    />
    <Route
      id="order"
      path={urls.order}
      element={
        <React.Suspense fallback={null}>
          <OrderPage />
        </React.Suspense>
      }
      handle={{
        tracking: {
          pageName: 'order_ip',
          pageType: PageType.funnel,
        },
      }}
    />
    <Route
      id="byoip"
      path={urls.byoip}
      element={
        <React.Suspense fallback={null}>
          <ByoipPage />
        </React.Suspense>
      }
      handle={{
        tracking: {
          pageName: 'bring-your-own_ip',
          pageType: PageType.funnel,
        },
      }}
    >
      <Route
        id="byoip-order"
        path={urls.byoipOrderModal}
        element={
          <React.Suspense fallback={null}>
            <ByoipOrderModalPage />
          </React.Suspense>
        }
        handle={{
          tracking: {
            pageName: 'bring-your-own_ip',
            pageType: PageType.popup,
          },
        }}
      />
    </Route>
  </Route>,
  <Route key="*" path="*" Component={NotFound} />,
];

export default Routes;
