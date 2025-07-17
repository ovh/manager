import React from 'react';

export const ManagedWordpressPage = React.lazy(
  () => import('@/pages/wordpressManaged/WordpressManaged.page')
);