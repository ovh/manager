import React from 'react';

export const ManagedWordpressPage = React.lazy(
  () => import('@/pages/managedWordpress/ManagedWordpress.page'),
);
export const ManagedWordpressResourcePage = React.lazy(
  () => import('@/pages/managedWordpress/ManagedWordpressResource/ManagedWordpressResource.page'),
);
export const ManagedWordpressServiceGeneralInformationPage = React.lazy(
  () => import('@/pages/managedWordpress/ManagedWordpressResource/myWebsites/MyWebsites.page'),
);
export const ManagedWordpressServiceTasksPage = React.lazy(
  () => import('@/pages/managedWordpress/ManagedWordpressResource/tasks/Tasks.page'),
);
export const ManagedWordpressServiceDelete = React.lazy(
  () => import('@/pages/managedWordpress/ManagedWordpressResource/delete/Delete.modal'),
);
export const ManagedWordpressServiceCreatePage = React.lazy(
  () => import('@/pages/managedWordpress/ManagedWordpressResource/create/Create.page'),
);
export const ManagedWordpressServiceImportPage = React.lazy(
  () => import('@/pages/managedWordpress/ManagedWordpressResource/import/Import.page'),
);

export const ManagedWordpressOnboardingPage = React.lazy(
  () => import('@/pages/managedWordpress/onboarding/Onboarding.page'),
);
