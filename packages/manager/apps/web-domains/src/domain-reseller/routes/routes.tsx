import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from '@ovh-ux/manager-react-components';
import { urls } from '@/domain-reseller/routes/routes.constants';

const LayoutPage = React.lazy(() => import('@/domain/pages/layout'));
const DomainResellerDashboard = React.lazy(() =>
  import('@/domain-reseller/pages/dashboard/DomainResellerDashboard'),
);
const DomainResellerInformationsPage = React.lazy(() =>
  import('@/domain-reseller/pages/tabs/DomainResellerInformations'),
);
const DomainResellerListPage = React.lazy(() =>
  import('@/domain-reseller/pages/tabs/ServiceList'),
);

export default (
  <>
    <Route
      path={urls.domainResellerRoot}
      Component={LayoutPage}
      id="domain-reseller-root"
      errorElement={
        <ErrorBoundary
          redirectionApp="web-domains"
          isPreloaderHide
          isRouteShellSync
        />
      }
    >
      <Route path={urls.domainResellerRoot} Component={DomainResellerDashboard}>
        <Route
          index
          element={<Navigate to={urls.domainResellerInformations} replace />}
        />
        <Route
          path={urls.domainResellerInformations}
          Component={DomainResellerInformationsPage}
        />
        <Route
          path={urls.domainResellerList}
          Component={DomainResellerListPage}
        />
      </Route>
    </Route>
  </>
);
