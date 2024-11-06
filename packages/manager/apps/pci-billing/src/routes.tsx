import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from '@/pages/Layout';

export const ROUTE_PATHS = {
  ROOT: '/pci/projects/:projectId/billing',
  BILLING: '',
  ESTIMATE: 'estimate',
  HISTORY: 'history/:year/:month',
};

const LayoutPage = lazy(() => import('@/pages/Layout'));
const BillingPage = lazy(() => import('@/pages/billing/Billing.page'));
const ConsumptionPage = lazy(() =>
  import('@/pages/billing/consumption/Consumption.page'),
);
const EstimatePage = lazy(() =>
  import('@/pages/billing/estimate/Estimate.page'),
);
const HistoryPage = lazy(() => import('@/pages/billing/history/History.page'));

const RoutesComponent = () => (
  <Routes>
    <Route
      id="root"
      path={ROUTE_PATHS.ROOT}
      Component={LayoutPage}
      errorElement={<ErrorBoundary />}
    >
      <Route path={ROUTE_PATHS.BILLING} Component={BillingPage}>
        <Route path={ROUTE_PATHS.BILLING} Component={ConsumptionPage}></Route>
        <Route path={ROUTE_PATHS.ESTIMATE} Component={EstimatePage}></Route>
        <Route path={ROUTE_PATHS.HISTORY} Component={HistoryPage}></Route>
      </Route>
    </Route>
    <Route path="" element={<>Page not found</>}></Route>
  </Routes>
);

export default RoutesComponent;
