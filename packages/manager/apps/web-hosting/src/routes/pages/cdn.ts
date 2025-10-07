import React from 'react';

export const ModifyCdnPage = React.lazy(
  () => import('@/pages/dashboard/multisite/cdn/ModifyCdn.page'),
);
export const PurgeCdnModal = React.lazy(
  () => import('@/pages/dashboard/multisite/cdn/PurgeCdn.modal'),
);
