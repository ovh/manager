import { lazy } from 'react';
import { Route } from 'react-router-dom';
import { ErrorBoundary } from '@/pages/Layout';
import { LISTING, ONBOARDING } from '@/tracking.constants';

const ROUTE_PATHS = {
  ROOT: '/pci/projects/:projectId/storages/volume-snapshots',
  LISTING: '',
  ONBOARDING: 'onboarding',
};

const LayoutPage = lazy(() => import('@/pages/Layout'));
const VolumeListPage = lazy(() => import('@/pages/listing/Listing.page'));
const OnBoardingPage = lazy(() => import('@/pages/onboarding/Onboarding.page'));

export default (
  <Route
    id="root"
    path={ROUTE_PATHS.ROOT}
    Component={LayoutPage}
    errorElement={<ErrorBoundary />}
  >
    <Route path="notFound" element={<>Page not found</>}></Route>
    <Route path={ROUTE_PATHS.LISTING} Component={VolumeListPage} id={LISTING} />
    <Route
      path={ROUTE_PATHS.ONBOARDING}
      Component={OnBoardingPage}
      id={ONBOARDING}
    />
  </Route>
);
