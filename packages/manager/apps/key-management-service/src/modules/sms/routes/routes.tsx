import React from 'react';
import { Route } from 'react-router-dom';
import { ErrorBoundary } from '@ovh-ux/manager-react-components';
import { SMS_ROUTES_URLS, SMS_URL_PARAMS } from './routes.constants';
import NotFound from '@/pages/404';

const KmsLayout = React.lazy(() => import('@/pages/layout'));
const SmsRoot = React.lazy(() => import('@/modules/sms/pages/root/root.page'));
const SmsOnboarding = React.lazy(() =>
  import('@/modules/sms/pages/onboarding/onboarding.page'),
);
const SecretListing = React.lazy(() =>
  import('@/modules/sms/pages/listing.page'),
);
const SecretDetail = React.lazy(() =>
  import('@/modules/sms/pages/detail.page'),
);
const SecretCreate = React.lazy(() =>
  import('@/modules/sms/pages/create.page'),
);

export default (
  <Route
    path={SMS_ROUTES_URLS.smsRoot}
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
    <Route path={SMS_ROUTES_URLS.smsRoot} Component={SmsRoot} />
    <Route path={SMS_ROUTES_URLS.smsOnboarding} Component={SmsOnboarding} />
    <Route
      path={SMS_ROUTES_URLS.secretListing(SMS_URL_PARAMS.domainId)}
      Component={SecretListing}
    />
    <Route
      path={SMS_ROUTES_URLS.secretDashboard(
        SMS_URL_PARAMS.domainId,
        SMS_URL_PARAMS.secretId,
      )}
      Component={SecretDetail}
    />
    <Route path={SMS_ROUTES_URLS.secretCreate} Component={SecretCreate} />
    <Route path={'*'} element={<NotFound />} />
  </Route>
);
