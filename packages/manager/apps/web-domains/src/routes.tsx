import React from 'react';
import { Route } from 'react-router-dom';
import AlldomRoutes from '@/alldoms/routes/routes';
import DomainRoutes from '@/domain/routes/routes';
import NotFound from '@/pages/404';

const routes = (
  <>
    {AlldomRoutes}
    {DomainRoutes}
    <Route path="*" element={<NotFound />} />
  </>
);

export default routes;
