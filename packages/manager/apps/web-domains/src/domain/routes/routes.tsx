import React from 'react';
import { Navigate, Outlet, Route, useParams } from 'react-router-dom';
import { PageType } from '@ovh-ux/manager-react-shell-client';
import { ErrorBoundary } from '@ovh-ux/manager-react-components';
import { urls } from '@/domain/routes/routes.constant';

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
          redirectionApp="web-domains-domain-backup"
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
        <Route path={urls.domainTabInformation} Component={Outlet} />
        <Route path={urls.domainTabZone} Component={Outlet} />
        <Route path={urls.domainTabDns} Component={Outlet} />
        <Route path={urls.domainTabRedirection} Component={Outlet} />
        <Route path={urls.domainTabDynHost} Component={Outlet} />
        <Route path={urls.domainTabHost} Component={Outlet} />
        <Route path={urls.domainTabDnssec} Component={Outlet} />
        <Route path={urls.domainTabContactManagement} Component={Outlet} />
      </Route>
      <Route path={urls.domainTabOrderAnycast} Component={AnycastOrderPage} />
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
