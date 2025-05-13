export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.ai.apps.dashboard.general-information.update-port',
    {
      url: '/update-port',
      views: {
        modal: {
          component:
            'ovhManagerPciProjectAppsDashboardGeneralInformationUpdateAppPort',
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
