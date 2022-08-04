import React, { Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
// import { useEnvironment } from '../core';

const Onboarding = React.lazy(() => import('./Onboarding'));
const Listing = React.lazy(() => import('./Listing'));
const Dashboard = React.lazy(() => import('./Dashboard'));

export default function App(): JSX.Element {
  // const env = useEnvironment();
  return (
    <HashRouter>
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
          <Route path="details">
            <Route index element={<Navigate to="/vps" />} />
            <Route
              path=":serviceId"
              element={
                <Suspense fallback="">
                  <Dashboard />
                </Suspense>
              }
            />
          </Route>
        </Route>
        <Route index element={<Navigate to="/vps" />} />
        <Route path="*" element={<div>404 page</div>} />
      </Routes>
    </HashRouter>
  );
}
