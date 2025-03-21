import { lazy } from 'react';
import { Route } from 'react-router-dom';
import { ErrorBoundary } from '@/pages/Layout';
import { LISTING } from '@/tracking.constants';

const ROUTE_PATHS = {
  ROOT: '/pci/projects/:projectId/storages/volume-snapshots',
  LISTING: '',
};

const LayoutPage = lazy(() => import('@/pages/Layout'));
const VolumeListPage = lazy(() => import('@/pages/listing/Listing.page'));

export default (
  <Route
    id="root"
    path={ROUTE_PATHS.ROOT}
    Component={LayoutPage}
    errorElement={<ErrorBoundary />}
  >
    <Route path="notFound" element={<>Page not found</>}></Route>
    <Route path={ROUTE_PATHS.LISTING} Component={VolumeListPage} id={LISTING} />
  </Route>
);
