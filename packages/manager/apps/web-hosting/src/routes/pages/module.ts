import React from 'react';

export const AddModuleModal = React.lazy(
  () => import('@/pages/dashboard/multisite/module/AddModule.modal'),
);

export const DeleteModuleModal = React.lazy(
  () => import('@/pages/dashboard/multisite/module/DeleteModule.modal'),
);
