export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.ai.apps.delete', {
    url: '/delete',
    params: { app: null },
    views: {
      modal: {
        component: 'ovhManagerPciProjectAppsDeleteapp',
      },
    },
    layout: 'modal',
    resolve: {
      app: /* @ngInject */ ($transition$) => $transition$.params().app,
      goBack: /* @ngInject */ (goToApps) => goToApps,
      breadcrumb: () => null,
      trackingPrefix: () => 'table::options_menu',
    },
  });
};
