import React from 'react';
import { Route, UIMatch } from 'react-router-dom';
import AlldomRoutes from '@/alldoms/routes/routes';
import DomainRoutes from '@/domain/routes/routes';
import NotFound from '@/pages/404';

export type RouteHandle = {
  isOverridePage?: boolean;
};
export type RouteMatch = UIMatch<unknown, RouteHandle>;

const routes = (
  <>
    {DomainRoutes}
    {AlldomRoutes}
    <Route path="*" element={<NotFound />} />
  </>
);

export default routes;
