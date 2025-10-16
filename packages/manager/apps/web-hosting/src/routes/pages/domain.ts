import React from 'react';

export const AddDomainPage = React.lazy(
  () => import('@/pages/dashboard/multisite/domain/AddDomain.page'),
);
export const DetacheDomainModal = React.lazy(
  () => import('@/pages/dashboard/multisite/domain/DetacheDomain.modal'),
);
export const ModifyDomainModal = React.lazy(
  () => import('@/pages/dashboard/multisite/domain/ModifyDomain.modal'),
);
export const OrderDomainPage = React.lazy(() => import('@/pages/dashboard/OrderDomain.page'));
