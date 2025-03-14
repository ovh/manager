import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from '@/pages/Layout';

const ROUTE_PATHS = {
  ROOT: '/pci/projects/:projectId/storages/volume-snapshots',
  LISTING: '',
};

const LayoutPage = lazy(() => import('@/pages/Layout'));

const RoutesComponent = () => (
  <Routes>
    <Route
      id="root"
      path={ROUTE_PATHS.ROOT}
      Component={LayoutPage}
      errorElement={<ErrorBoundary />}
    ></Route>
    <Route path="" element={<>Page not found</>}></Route>
  </Routes>
);

export default RoutesComponent;
