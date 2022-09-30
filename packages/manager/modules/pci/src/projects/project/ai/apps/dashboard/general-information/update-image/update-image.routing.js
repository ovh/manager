export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.ai.apps.dashboard.general-information.update-image',
    {
      url: '/update-image',
      views: {
        modal: {
          component: 'ovhManagerPciProjectAppsUpdateAppImage',
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: () => null,
        trackingPrefix: () => 'dashboard',
      },
    },
  );
};
