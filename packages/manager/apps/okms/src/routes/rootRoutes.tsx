import React from 'react';
import { Route } from 'react-router-dom';

const KmsLayout = React.lazy(() => import('@/pages/layout'));
const AppRoot = React.lazy(() => import('@/pages'));

export default (
  <Route id={'root'} Component={KmsLayout}>
    <Route path="/" Component={AppRoot} />
  </Route>
);
