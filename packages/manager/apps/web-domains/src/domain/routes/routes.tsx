import React from 'react';
import { Navigate, Outlet, Route, useParams } from 'react-router-dom';
import { PageType } from '@ovh-ux/manager-react-shell-client';
import { ErrorBoundary } from '@ovh-ux/manager-react-components';
import { urls } from '@/domain/routes/routes.constant';
import WebHostingOrderPage from '../pages/domainTabs/generalInformations/webhostingOrder';
import ZoneLayout from '@/zone/pages/Layout';
import ZonePage from '@/zone/pages/zone/Zone.page';
import HistoryPage from '@/zone/pages/zone/history/History.page';
import ResetModal from '@/zone/pages/zone/reset/Reset.modal';
import DeleteModal from '@/zone/pages/zone/delete/Delete.modal';
import AddEntryModal from '@/zone/pages/zone/add/AddEntry.modal';
import ModifyEntryModal from '@/zone/pages/zone/modify/ModifyEntry.modal';
import ModifyTtlModal from '@/zone/pages/zone/modify/ModifyTtl.modal';
import DeleteEntryModal from '@/zone/pages/zone/delete/DeleteEntry.modal';
import ModifyTextualRecordModal from '@/zone/pages/zone/modify/ModifyTextualRecord.modal';

const LayoutPage = React.lazy(() => import('@/domain/pages/layout'));
const DomainListingPage = React.lazy(() =>
  import('@/domain/pages/service/serviceList/serviceList'),
);

const DomainDetailPage = React.lazy(() =>
  import('@/domain/pages/service/serviceDetail/serviceDetail'),
);

const OnboardingPage = React.lazy(() =>
  import('@/domain/pages/onboarding/onboarding'),
);

const AnycastOrderPage = React.lazy(() =>
  import('@/domain/pages/domainTabs/dns/anycastOrder'),
);

const DnsModifyPage = React.lazy(() =>
  import('@/domain/pages/domainTabs/dns/dnsModify'),
);

const GeneralInformationsPage = React.lazy(() =>
  import('@/domain/pages/domainTabs/generalInformations/generalInformations'),
);

const HostsListingTab = React.lazy(() =>
  import('@/domain/pages/domainTabs/hosts/hostsListing'),
);

const HostConfigurationDeletePage = React.lazy(() =>
  import('@/domain/pages/domainTabs/hosts/hostDelete'),
);

const ContactManagementPage = React.lazy(() =>
  import('@/domain/pages/domainTabs/contactManagement/contactManagement'),
);

const DsRecordListingPage = React.lazy(() =>
  import('@/domain/pages/domainTabs/dsRecords/dsRecordsListing'),
);

function RedirectToDefaultTab() {
  const { serviceName } = useParams<{ serviceName: string }>();
  return (
    <Navigate
      to={urls.domainTabInformation.replace(':serviceName', serviceName)}
      replace
    />
  );
}

export default (
  <>
    <Route
      path={urls.domainRoot}
      Component={LayoutPage}
      id="domain-root"
      errorElement={
        <ErrorBoundary
          redirectionApp="web-domains"
          isPreloaderHide
          isRouteShellSync
        />
      }
    >
      <Route
        path={urls.domainRoot}
        Component={DomainListingPage}
        id="domainListing"
        handle={{
          tracking: {
            pageName: 'listing',
            pageType: PageType.listing,
          },
        }}
      />

      <Route
        path={urls.domainDetail}
        Component={DomainDetailPage}
        id="domainDetail"
        handle={{
          tracking: {
            pageName: 'domainDetail',
            pageType: PageType.dashboard,
          },
        }}
      >
        {/* Routes used for Service Detail tabs */}
        <Route element={<RedirectToDefaultTab />} index />
        <Route
          path={urls.domainTabInformation}
          Component={GeneralInformationsPage}
        />
        <Route path={urls.domainTabZone} Component={ZoneLayout}>
          <Route path="history" Component={HistoryPage} id="zoneHistory" handle={{ isOverridePage: true}}/>
            <Route path="add-entry" Component={AddEntryModal} id="zoneAddEntry" handle={{ isOverridePage: true}}/>
            <Route path="delete" Component={DeleteModal} id="zoneDelete" handle={{ isOverridePage: true}}/>
            <Route path="delete-entry" Component={DeleteEntryModal} id="zoneDeleteEntry" handle={{ isOverridePage: true}}/>
            <Route path="modify-entry" Component={ModifyEntryModal} id="zoneModifyEntry" handle={{ isOverridePage: true}}/>
            <Route path="modify-textual-record" Component={ModifyTextualRecordModal} id="zoneModifyTextualRecord" handle={{ isOverridePage: true}}/>
            <Route path="modify-ttl" Component={ModifyTtlModal} id="zoneModifyTtlRecord" handle={{ isOverridePage: true}} />
            <Route path="reset" Component={ResetModal} id="zoneReset" handle={{ isOverridePage: true}}/>
        </Route>
        <Route path={urls.domainTabDns} Component={Outlet} />
        <Route path={urls.domainTabRedirection} Component={Outlet} />
        <Route path={urls.domainTabDynHost} Component={Outlet} />

        <Route path={urls.domainTabHost} Component={HostsListingTab}>
          <Route
            path={urls.domainTabHostDelete}
            Component={HostConfigurationDeletePage}
          />
        </Route>
        <Route path={urls.domainTabDsrecords} Component={DsRecordListingPage} />
        <Route
          path={urls.domainTabContactManagement}
          Component={ContactManagementPage}
        />
      </Route>
      <Route path={urls.domainTabOrderAnycast} Component={AnycastOrderPage} />
      <Route
        path={urls.domainTabWebHostingOrder}
        Component={WebHostingOrderPage}
      />
      <Route path={urls.domainTabDnsModify} Component={DnsModifyPage} />
      <Route
        path={urls.domainOnboarding}
        Component={OnboardingPage}
        id="onboarding-domain"
        handle={{
          tracking: {
            pageName: 'onboarding-domain',
            pageType: PageType.onboarding,
          },
        }}
      />
    </Route>
    <Route path="/" element={<Navigate to={urls.domainRoot} replace />} />
  </>
);
