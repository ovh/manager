import { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

export const ROUTE_PATHS = {
  ROOT: '/pci/projects/:projectId/octavia-load-balancer',
  LISTING: 'load-balancers',
};

const LayoutPage = lazy(() => import('@/pages/Layout'));
const ListPage = lazy(() => import('@/pages/listing/Listing.page'));

const RoutesComponent = () => (
  <Routes>
    <Route id="root" path={ROUTE_PATHS.ROOT} Component={LayoutPage}>
      <Route path="" element={<Navigate to={ROUTE_PATHS.LISTING} replace />} />
      <Route path={ROUTE_PATHS.LISTING} Component={ListPage} />
    </Route>
    <Route path="" element={<>Page not found</>}></Route>
  </Routes>
);

export default RoutesComponent;
