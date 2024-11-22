import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

const ROUTE_PATHS = {
  ROOT: '/pci/projects/:projectId/storages/objects',
  LISTING: '',
};

const LayoutPage = lazy(() => import('@/pages/Layout'));

const RoutesComponent = () => (
  <Routes>
    <Route id="root" path={ROUTE_PATHS.ROOT} Component={LayoutPage}></Route>
    <Route path="" element={<>Page not found</>}></Route>
  </Routes>
);

export default RoutesComponent;
