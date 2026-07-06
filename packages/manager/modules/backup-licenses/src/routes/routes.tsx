import React from 'react';

import { Route } from 'react-router-dom';

const MainLayout = React.lazy(() => import('../pages/MainLayout.component'));

export default (
  <>
    <Route path="" Component={MainLayout}></Route>
  </>
);
