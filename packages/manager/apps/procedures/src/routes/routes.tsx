import React from 'react';

import { Route } from 'react-router-dom';

import { ErrorBoundary } from '@ovh-ux/manager-react-components';

import { createRoutePath, errorRoutePath, seeRoutePath } from '@/routes/mfa.constants';

import NotFound from '../pages/404';

// Disable MFA
const DisableMfaPage = React.lazy(() => import('@/pages/disableMFA/DisableMFA.page'));
const DisableMfaCreatePage = React.lazy(() => import('@/pages/disableMFA/create/Create.page'));
const DisableMfaCreateFormPage = React.lazy(
  () => import('@/pages/disableMFA/create/form/Form.page'),
);
const DisableMfaSeePage = React.lazy(() => import('@/pages/disableMFA/see/See.page'));
const DisableMfaErrorPage = React.lazy(() => import('@/pages/disableMFA/error/Error.page'));

// GDPR
const GDPRPage = React.lazy(() => import('@/pages/rgdp/RGDP.page'));

// path definitions
export const accountDisable2faRoute = '/account-disable-2fa';
export const exercisingYourRightsRoute = '/exercising-your-rights';

export default (
  <Route
    id="root"
    errorElement={
      <ErrorBoundary redirectionApp="procedures" isPreloaderHide={true} isRouteShellSync={false} />
    }
  >
    {/* Disable 2FA / MFA Routes */}
    <Route path={accountDisable2faRoute} element={<DisableMfaPage />}>
      <Route
        path={`${accountDisable2faRoute}/${createRoutePath}`}
        element={<DisableMfaCreatePage />}
      >
        <Route path="" element={<DisableMfaCreateFormPage />} />
      </Route>

      <Route path={`${accountDisable2faRoute}/${seeRoutePath}`} element={<DisableMfaSeePage />} />
      <Route
        path={`${accountDisable2faRoute}/${errorRoutePath}`}
        element={<DisableMfaErrorPage />}
      />
    </Route>
    {/* GDPR Routes */}
    <Route path={exercisingYourRightsRoute} element={<GDPRPage />} />
    <Route path={'*'} element={<NotFound />} />
  </Route>
);
