import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { odsSetup } from '@ovhcloud/ods-common-core';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import '@ovhcloud/ods-theme-blue-jeans';
import queryClient from './query.client';
import { Routes } from './routes/routes';
import { decodeToken, extractToken } from '@/utils/token';
import initI18n from './i18n';
import initAuthenticationInterceptor from '@/data/authentication.interceptor';
import initInterceptor from './data/invisible-challenge.interceptor';
import UserProvider from '@/context/User/provider';
import { getRedirectLoginUrl } from '@/utils/url-builder';

const token = extractToken();
const user = decodeToken(token);
const { language: locale, subsidiary } = user || {};

// If we don't have a user or the "session" is expired we redirect the user on the login page
if (!user || user.exp * 1000 < Date.now()) {
  const redirectUrl = getRedirectLoginUrl(user);
  window.location.assign(redirectUrl);
} else {

  initI18n(locale || 'en_GB', [locale || 'en_GB'], subsidiary);
  initAuthenticationInterceptor(token);
  initInterceptor();

  odsSetup();
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
