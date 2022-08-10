import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

const Onboarding = React.lazy(() => import('./Onboarding'));
const Listing = React.lazy(() => import('./Listing'));
const Dashboard = React.lazy(() => import('./Dashboard'));

export default function App(): JSX.Element {
  return (
    <>
      <div>Breadcrumb</div>
      <Routes>
        <Route path="nutanix">
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
            <Route index element={<Navigate to="/nutanix" />} />
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
        <Route index element={<Navigate to="/nutanix" />} />
        <Route path="*" element={<div>404 page</div>} />
      </Routes>
    </>
  );
}
