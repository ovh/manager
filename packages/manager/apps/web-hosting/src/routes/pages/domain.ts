import React from 'react';

export const AddDomainPage = React.lazy(
  () => import('@/pages/dashboard/multisite/domain/AddDomain.page'),
);

export const OrderDomainPage = React.lazy(() => import('@/pages/dashboard/OrderDomain.page'));
