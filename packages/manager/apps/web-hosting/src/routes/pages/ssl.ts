import React from 'react';

export const DisableSslPage = React.lazy(
  () => import('@/pages/dashboard/ssl/manage/disableSsl.page'),
);
export const ImportSslPage = React.lazy(() => import('@/pages/dashboard/ssl/add/importSsl.page'));
export const OrderSectigoPage = React.lazy(
  () => import('@/pages/dashboard/ssl/add/orderSectigo.page'),
);

export const SanSslPage = React.lazy(() => import('@/pages/dashboard/ssl/manage/sanSsl.page'));
export const SslPage = React.lazy(() => import('@/pages/dashboard/ssl/Ssl.page'));
