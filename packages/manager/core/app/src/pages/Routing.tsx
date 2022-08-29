import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import { Route } from 'use-react-router-breadcrumbs';

const Onboarding = React.lazy(() => import('./Onboarding'));
const Listing = React.lazy(() => import('./Listing'));
const NodesListing = React.lazy(() => import('./NodesListing'));
const Dashboard = React.lazy(() => import('./Dashboard'));

export default function Routing(): JSX.Element {
  const { t } = useTranslation('nutanix');
  return (
    <>
      <Route path="nutanix">
        <Route
          index
          breadcrumb={t('nutanix')}
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
        <Route path=":serviceId">
          <Route index element={<Navigate to="details" replace={true} />} />
          <Route
            breadcrumb={t('generic_infos')}
            path="details"
            element={
              <Suspense fallback="">
                <Dashboard />
              </Suspense>
            }
          />
          <Route path="nodes">
            <Route
              index
              element={
                <Suspense fallback="">
                  <NodesListing />
                </Suspense>
              }
            />
          </Route>
        </Route>
      </Route>
      <Route index element={<Navigate to="/nutanix" replace={true} />} />
      <Route path="*" element={<div>404 page</div>} />
    </>
  );
}
