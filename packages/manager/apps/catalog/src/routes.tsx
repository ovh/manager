import { ErrorBoundary } from '@ovh-ux/manager-react-components';
import React from 'react';
import { Route } from 'react-router-dom';
import NotFound from './pages/404';

const LayoutPage = React.lazy(() => import('@/pages/layout'));
const IndexPage = React.lazy(() => import('@/pages/index'));

export default (
  <Route
    path={'/'}
    Component={LayoutPage}
    id={'root'}
    errorElement={
      <ErrorBoundary
        redirectionApp="catalog"
        isPreloaderHide={true}
        isRouteShellSync={true}
      />
    }
  >
    <Route path={'/'} Component={IndexPage} />
    <Route path={'*'} element={<NotFound />} />
  </Route>
);
