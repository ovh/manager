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

const token = extractToken();
const user = decodeToken(token);
const { language: locale, subsidiary } = user || {};

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
