import React, { Suspense } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { odsSetup } from '@ovhcloud/ods-common-core';
import {
  useDefaultLanguage,
  findAvailableLocale,
  detectUserLocale,
} from '@ovh-ux/manager-config';
import {
  RouterProvider,
  createHashRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import '@ovhcloud/ods-theme-blue-jeans';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { OsdsSpinner } from '@ovhcloud/ods-components/react';
import queryClient from '@/query.client';
import Routes, {
  accountDisable2faRoute,
  exercisingYourRightsRoute,
} from '@/routes/routes';
import { decodeToken, extractToken } from '@/utils/token';
import initI18n from '@/i18n';
import initAuthenticationInterceptor from '@/data/authentication.interceptor';
import initInterceptor from '@/data/invisible-challenge.interceptor';
import UserProvider from '@/context/User/provider';
import {
  getRedirectLoginUrl,
  getWebSiteRedirectUrl,
} from '@/utils/url-builder';

function getSubsidiary(subsidiary: string, locale: string) {
  if (subsidiary?.trim()?.length === 0)
    return locale?.trim()?.length === 0 ? 'IE' : locale.slice(-2);
  return subsidiary;
}

const activateAuthenticationInterceptorForPath = [accountDisable2faRoute];
const routeRedirectMap: Record<string, string> = {
  [accountDisable2faRoute]: getRedirectLoginUrl(undefined),
  [exercisingYourRightsRoute]: getWebSiteRedirectUrl(),
};

const token = extractToken();
const user = decodeToken(token);
const { subsidiary } = user || {};

if (!user) {
  const redirectRoute = Object.keys(routeRedirectMap).find((route) =>
    window.location.href.includes(route),
  );

  if (redirectRoute) {
    const redirectUrl = routeRedirectMap[redirectRoute];
    window.location.assign(redirectUrl);
  }
}

useDefaultLanguage('en_GB');
const locale = findAvailableLocale(detectUserLocale());

initI18n(locale, getSubsidiary(subsidiary, locale));
odsSetup();
initInterceptor();

if (
  activateAuthenticationInterceptorForPath.some((path) =>
    window.location.href.includes(path),
  )
) {
  initAuthenticationInterceptor(token);
}

export default function App() {
  const router = createHashRouter(createRoutesFromElements(Routes));
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider user={user}>
        <Suspense fallback={<OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />}>
          <RouterProvider router={router} />
        </Suspense>
      </UserProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
