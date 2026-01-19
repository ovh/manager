import React from 'react';
import { Route } from 'react-router-dom';
import { ErrorBoundary } from '@ovh-ux/manager-react-components';
import { urls } from '@/domain-reseller/routes/routes.constants';

const LayoutPage = React.lazy(() => import('@/domain/pages/layout'));
const DomainResellerDashboardPage = React.lazy(() =>
  import('@/domain-reseller/pages/dashboard/DomainResellerDashboard'),
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
      <Route
        path={urls.domainResellerRoot}
        Component={DomainResellerDashboardPage}
      />
    </Route>
  </>
);
