import React from 'react';

export const AddWebsitePage = React.lazy(
  () => import('@/pages/dashboard/multisite/website/AddWebsite.page'),
);

export const UpdateDisplayNameModalComponent = React.lazy(
  () => import('@/pages/dashboard/multisite/component/edit-name/EditName.modal'),
);
