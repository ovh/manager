import { lazy } from 'react';
import { Route } from 'react-router-dom';
import { ErrorBoundary } from '@/pages/Layout';
import { LISTING, CREATE, DELETE } from '@/tracking.constants';

export const ROUTE_PATHS = {
  ROOT: '/pci/projects/:projectId/storages/volume-snapshots',
  LISTING: '',
  CREATE_VOLUME: ':snapshotId/new-volume',
  DELETE: 'delete',
  BLOCK_STORAGE: '/pci/projects/:projectId/storages/blocks',
};

const LayoutPage = lazy(() => import('@/pages/Layout'));
const VolumeListPage = lazy(() => import('@/pages/listing/Listing.page'));
const CreateVolumePage = lazy(() =>
  import('@/pages/create-volume/CreateVolume.page'),
);
const VolumeDeletePage = lazy(() =>
  import('@/pages/listing/delete/Delete.page'),
);

export default (
  <Route
    id="root"
    path={ROUTE_PATHS.ROOT}
    Component={LayoutPage}
    errorElement={<ErrorBoundary />}
  >
    <Route path="notFound" element={<>Page not found</>}></Route>
    <Route path={ROUTE_PATHS.LISTING} Component={VolumeListPage} id={LISTING}>
      <Route
        path={ROUTE_PATHS.DELETE}
        Component={VolumeDeletePage}
        id={DELETE}
      />
    </Route>
    <Route
      path={ROUTE_PATHS.CREATE_VOLUME}
      Component={CreateVolumePage}
      id={CREATE}
    />
  </Route>
);
