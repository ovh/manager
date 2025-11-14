import React from 'react';

export const ModifyCdnPage = React.lazy(
  () => import('@/pages/dashboard/multisite/cdn/ModifyCdn.page'),
);
export const PurgeCdnModal = React.lazy(
  () => import('@/pages/dashboard/multisite/cdn/PurgeCdn.modal'),
);
export const AdvancedFlushCdnModal = React.lazy(
  () => import('@/pages/dashboard/multisite/cdn/AdvancedFlushCdn.modal'),
);
export const CdnCacheRuleModal = React.lazy(
  () => import('@/pages/dashboard/multisite/cdn/CdnCacheRule.modal'),
);
export const CdnEditUrlsModal = React.lazy(
  () => import('@/pages/dashboard/multisite/cdn/CdnEditUrls.modal'),
);
export const CdnCorsResourceSharingModal = React.lazy(
  () => import('@/pages/dashboard/multisite/cdn/CdnCorsResourceSharing.modal'),
);
export const CdnConfirmationModal = React.lazy(
  () => import('@/pages/dashboard/multisite/cdn/CdnConfirmation.modal'),
);
export const ActivateCdnModal = React.lazy(
  () => import('@/pages/dashboard/multisite/cdn/ActivateCdn.modal'),
);
