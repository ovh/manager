import { ErrorBoundary } from '@ovh-ux/manager-react-components';
import React from 'react';
import { Route } from 'react-router-dom';
import { SMS_ROUTES_URIS, SMS_URL_PARAMS } from './routes.constants';
import NotFound from '@/pages/404';

const KmsLayout = React.lazy(() => import('@/pages/layout'));
const SmsOnboarding = React.lazy(() =>
  import('@/modules/sms/pages/onboarding.page'),
);
const SecretListing = React.lazy(() =>
  import('@/modules/sms/pages/listing.page'),
);
const SecretDetail = React.lazy(() =>
  import('@/modules/sms/pages/detail.page'),
);

export default (
  <Route
    path={SMS_ROUTES_URIS.root}
    Component={KmsLayout}
    id={'sms-root'}
    errorElement={
      <ErrorBoundary
        redirectionApp="key-management-service"
        isPreloaderHide={true}
        isRouteShellSync={true}
      />
    }
  >
    <Route path={''} Component={SmsOnboarding} />
    <Route
      path={`${SMS_URL_PARAMS.domainId}/${SMS_ROUTES_URIS.secrets}`}
      Component={SecretListing}
    />
    <Route
      path={`${SMS_URL_PARAMS.domainId}/${SMS_ROUTES_URIS.secrets}/${SMS_URL_PARAMS.secretId}`}
      Component={SecretDetail}
    />
    <Route path={'*'} element={<NotFound />} />
  </Route>
);
