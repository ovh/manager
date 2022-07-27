import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEnvironment } from '../core';

const Onboarding = React.lazy(() => import('./Onboarding'));
const Listing = React.lazy(() => import('./Listing'));
const Dashboard = React.lazy(() => import('./Dashboard'));

export default function App(): JSX.Element {
  const { t } = useTranslation('home');
  const env = useEnvironment();
  return (
    <HashRouter>
      <pre>{`${t('hello')} ${env.user.nichandle}`}</pre>
      <div>Breadcrumb</div>
      <Routes>
        <Route path="vps">
          <Route
            index
            element={
              <Suspense fallback="">
                <Listing />
              </Suspense>
            }
          />
          <Route
            path="onboarding"
            element={
              <Suspense fallback="">
                <Onboarding />
              </Suspense>
            }
          />
          <Route
            path=":serviceId"
            element={
              <Suspense fallback="">
                <Dashboard />
              </Suspense>
            }
          />
        </Route>
        <Route index element={<Navigate to="/vps" />} />
        <Route path="*" element={<div>404 page</div>} />
      </Routes>
    </HashRouter>
  );
}
