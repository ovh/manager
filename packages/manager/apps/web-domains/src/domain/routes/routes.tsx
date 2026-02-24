import React from 'react';
import { Navigate, Outlet, Route, useParams } from 'react-router-dom';
import { PageType } from '@ovh-ux/manager-react-shell-client';
import { ErrorBoundary } from '@ovh-ux/manager-react-components';
import { urls } from '@/domain/routes/routes.constant';
import { urls as zoneUrls } from '@/zone/routes/routes.constant';
import WebHostingOrderPage from '../pages/domainTabs/generalInformations/webhostingOrder';


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
// zone routes and pages
const ZoneLayout = React.lazy(() =>
  import('@/zone/pages/Layout'),
);
const ZonePage = React.lazy(() =>
  import('@/zone/pages/zone/Zone.page'),
);
const HistoryPage = React.lazy(() =>
  import('@/zone/pages/zone/history/History.page'),
);
const CompareZonesPage = React.lazy(() =>
  import('@/zone/pages/zone/compare/CompareZones.page'),
);
const ModifyTextualRecordPage = React.lazy(() =>
  import('@/zone/pages/zone/modify/ModifyTextualRecord.page'),
);

const ActivateZonePage = React.lazy(() =>
  import('@/zone/pages/zone/activate/ActivateZone.page'),
);
function RedirectToDefaultTab() {
  const { serviceName } = useParams<{ serviceName: string }>();
  return (
    <Navigate
      to={urls.domainTabInformation.replace(':serviceName', serviceName ?? '')}
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
          <Route path={zoneUrls.zoneRoot} Component={ZonePage} />
          <Route path={zoneUrls.zoneActivate} Component={ActivateZonePage} />
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
      <Route path={zoneUrls.zoneHistory} Component={HistoryPage} />
      <Route path={zoneUrls.zoneCompare} Component={CompareZonesPage} />
      <Route path={zoneUrls.zoneModifyTextualRecord} Component={ModifyTextualRecordPage} />
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
