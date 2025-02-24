import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

const ROUTE_PATHS = {
  ROOT: '/pci/projects/:projectId',
  QUOTA: 'quota',
  CONTACT_SUPPORT: 'increase/contact-support',
  BUY_CREDIT: 'increase/buy-credit',
  REGIONS: 'regions',
};

const LayoutPage = lazy(() => import('@/pages/Layout'));
const QuotaPage = lazy(() => import('@/pages/quota/Quota.page'));
const IncreaseQuotaPage = lazy(() =>
  import('@/pages/quota/IncreaseQuota.page'),
);
const RegionsPage = lazy(() => import('@/pages/regions/Regions.page'));

const RoutesComponent = () => (
  <Routes>
    <Route id="root" path={ROUTE_PATHS.ROOT} Component={LayoutPage}>
      <Route path={ROUTE_PATHS.QUOTA} Component={QuotaPage}>
        <Route
          path={ROUTE_PATHS.CONTACT_SUPPORT}
          Component={IncreaseQuotaPage}
        ></Route>
        <Route
          path={ROUTE_PATHS.BUY_CREDIT}
          Component={IncreaseQuotaPage}
        ></Route>
      </Route>
      <Route path={ROUTE_PATHS.REGIONS} Component={RegionsPage} />
    </Route>
    <Route path="" element={<>Page not found</>}></Route>
  </Routes>
);

export default RoutesComponent;
