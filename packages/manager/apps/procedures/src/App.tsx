import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { odsSetup } from '@ovhcloud/ods-common-core';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import '@ovhcloud/ods-theme-blue-jeans';
import queryClient from './query.client';
import {
  accountDisable2faRoute,
  exercisingYourRightsRoute,
  Routes,
} from './routes/routes';
import { decodeToken, extractToken } from '@/utils/token';
import initI18n from './i18n';
import initAuthenticationInterceptor from '@/data/authentication.interceptor';
import initInterceptor from './data/invisible-challenge.interceptor';
import UserProvider from '@/context/User/provider';
import { getRedirectLoginUrl } from '@/utils/url-builder';

function getSubsidiary(subsidiary: string, locale: string) {
  if (subsidiary?.trim()?.length === 0)
    return locale?.trim()?.length === 0 ? 'IE' : locale.slice(-2);
  return subsidiary;
}

const activateAuthenticationInterceptorForPath = [accountDisable2faRoute];
const token = extractToken();
const user = decodeToken(token);
const { language: locale, subsidiary } = user || {};

if (!user) {
  const redirectUrl = getRedirectLoginUrl(user);
  window.location.assign(redirectUrl);
}

initI18n(locale || 'en_GB', getSubsidiary(subsidiary, locale));
odsSetup();
initInterceptor();

if (
  activateAuthenticationInterceptorForPath.some((path) =>
    window.location.href.includes(path),
  )
) {
  initAuthenticationInterceptor(token);
}

const router = createHashRouter(Routes);

const Router = () => <RouterProvider router={router} />;

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider user={user}>
        <Router />
        <ReactQueryDevtools initialIsOpen={false} />
      </UserProvider>
    </QueryClientProvider>
  );
}
