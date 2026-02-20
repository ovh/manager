import { Route } from 'react-router-dom';
import AlldomRoutes from '@/alldoms/routes/routes';
import DomainRoutes from '@/domain/routes/routes';
import DomainResellerRoutes from '@/domain-reseller/routes/routes';
import NotFound from '@/pages/404';

const routes = (
  <>
    {DomainRoutes}
    {AlldomRoutes}
    {DomainResellerRoutes}
    <Route path="*" element={<NotFound />} />
  </>
);

export default routes;
