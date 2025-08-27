import React from 'react';

export const LocalSeoPage = React.lazy(() => import('@/pages/dashboard/local-seo/LocalSeo.page'));
export const RemoveSeoSubscriptionPage = React.lazy(
  () => import('@/pages/dashboard/local-seo/manage/RemoveSeoSubscription.page'),
);
