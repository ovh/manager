export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.ai.apps.delete', {
    url: '/delete?appId',
    views: {
      modal: {
        component: 'ovhManagerPciAiAppsDelete',
      },
    },
    layout: 'modal',
    params: {
      appId: null,
    },
    resolve: {
      goBack: /* @ngInject */ (goToApps) => goToApps,
      appId: /* @ngInject */ ($stateParams) => $stateParams.appId,
      breadcrumb: () => null,
    },
  });
};
