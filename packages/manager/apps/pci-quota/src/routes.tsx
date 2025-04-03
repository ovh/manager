import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from '@/pages/Layout';

import QuotaPage from '@/pages/quota/Quota.page';
import RegionsPage from '@/pages/regions/Regions.page';
import IncreaseQuotaSupportpage from './pages/quota/IncreaseQuotaSupport.page';

export const ROUTE_PATHS = {
  ROOT: '/pci/projects/:projectId',
  QUOTA_LAYOUT: '',
  QUOTA: 'quota',
  CONTACT_SUPPORT: 'quota/increase/contact-support',
  BUY_CREDIT: 'increase/buy-credit',
  REGIONS: 'regions',
};

const LayoutPage = lazy(() => import('@/pages/Layout'));
const QuotaTabs = lazy(() => import('@/pages/QuotaTabs'));
const IncreaseQuotaPage = lazy(() =>
  import('@/pages/quota/IncreaseQuota.page'),
);

const RoutesComponent = () => (
  <Routes>
    <Route
      id="root"
      path={ROUTE_PATHS.ROOT}
      Component={LayoutPage}
      errorElement={<ErrorBoundary />}
    >
      <Route path={ROUTE_PATHS.QUOTA_LAYOUT} Component={QuotaTabs}>
        <Route path={ROUTE_PATHS.QUOTA} Component={QuotaPage}>
          <Route path={ROUTE_PATHS.BUY_CREDIT} Component={IncreaseQuotaPage} />
        </Route>

        <Route path={ROUTE_PATHS.REGIONS} Component={RegionsPage} />
      </Route>
      <Route
        path={ROUTE_PATHS.CONTACT_SUPPORT}
        Component={IncreaseQuotaSupportpage}
      />
    </Route>
    <Route path="" element={<>Page not found</>}></Route>
  </Routes>
);

export default RoutesComponent;
