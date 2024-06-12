import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { decodeToken, extractToken } from '@/utils/token';
import initI18n from './i18n';
import initAuthenticationInterceptor from '@/data/authentication.interceptor';
import initInterceptor from './data/invisible-challenge.interceptor';
import './global.css';
import './index.scss';
import UserProvider from '@/context/User/provider';
import { getRedirectLoginUrl } from './utils/url-builder';

const token = extractToken();
const user = decodeToken(token);
const { language: locale, subsidiary } = user || {};

// If we don't have a user or the "session" is expired we redirect the user on the login page
if (!user || user.exp * 1000 < Date.now()) {
  const redirectUrl = getRedirectLoginUrl(user);
  window.location.assign(redirectUrl);
} else {
  initI18n(locale, [locale], subsidiary);
  initAuthenticationInterceptor(token);
  initInterceptor();

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <UserProvider user={user}>
        <App />
      </UserProvider>
    </React.StrictMode>,
  );
}
